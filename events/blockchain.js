"use strict";

import { promisify } from "util";

import { parameters } from "../config/parameters.js";
import { writeFile } from "../export/file-helper.js";
import { tryBlockByBlock } from "./block-by-block.js";
import { getEvents } from "./block-reader.js";
import { getFiles } from "./last-downloaded-block.js";

const sleep = promisify(setTimeout);

const groupBy = (objectArray, property) => {
  return objectArray.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
};

const tryGetEvents = async (start, end, symbol, contract) => {
  try {
    const filter = contract.filters.Transfer();
    const pastEvents = await contract.queryFilter(filter, start, end);

    if (pastEvents.length) {
      console.info("Successfully imported ", pastEvents.length, " events");
    }

    const group = groupBy(pastEvents, "blockNumber");

    for (const key in group) {
      // if (group.hasOwnProperty(key)) {
      if (Object.prototype.hasOwnProperty.call(group, key)) {
        const blockNumber = key;
        const data = group[key];

        const file = parameters.eventsDownloadFilePath
          .replace(/{token}/g, symbol)
          .replace(/{blockNumber}/, blockNumber);

        writeFile(file, data);
      }
    }
  } catch (e) {
    console.log("Could not get events due to an error. Now checking block by block.");
    await tryBlockByBlock(contract, start, end, symbol);
  }
};

export const getEventsData = async (config, provider, contract) => {
  const name = await contract.name();
  const symbol = await contract.symbol();
  const decimals = await contract.decimals();
  const blockHeight = await provider.getBlockNumber();
  let fromBlock = parseInt(config.fromBlock) || 0;
  const blocksPerBatch = parseInt(config.blocksPerBatch) || 0;
  const delay = parseInt(config.delay) || 0;
  const toBlock = parseInt(config.toBlock) || blockHeight;

  const lastDownloadedBlock = await getFiles(symbol);

  if (lastDownloadedBlock) {
    console.log("Resuming from the last downloaded block #", lastDownloadedBlock);
    fromBlock = lastDownloadedBlock + 1;
  }

  console.log("From %d to %d", fromBlock, toBlock);

  let start = fromBlock;
  let end = fromBlock + blocksPerBatch;
  let i = 0;

  while (end < toBlock) {
    i++;

    if (delay) {
      await sleep(delay);
    }

    console.log("Batch", i + 1, " From", start, "to", end);

    await tryGetEvents(start, end, symbol, contract);

    start = end + 1;
    end = start + blocksPerBatch;

    if (end > toBlock) {
      end = toBlock;
    }
  }

  const events = await getEvents(symbol);

  const data = {
    name,
    symbol,
    decimals,
    events: events
  };

  return data;
};
