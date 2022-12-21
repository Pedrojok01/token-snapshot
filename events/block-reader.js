"use strict";

import { readdir, readFile } from "fs";
import { join } from "path";
import { promisify } from "util";

import { parameters } from "../config/parameters.js";

const readdirAsync = promisify(readdir);
const readFileAsync = promisify(readFile);

const getMinimal = (pastEvents) => {
  return pastEvents.map((tx) => {
    return {
      transactionHash: tx.transactionHash,
      from: tx.args["0"],
      to: tx.args["1"],
      value: tx.args["2"].hex
    };
  });
};

export const getEvents = async (symbol) => {
  const directory = parameters.eventsDownloadFolder.replace(/{token}/g, symbol);
  const files = await readdirAsync(directory);
  files.sort((a, b) => {
    return parseInt(a.split(".")[0]) - parseInt(b.split(".")[0]);
  });
  let events = [];

  console.log("Parsing files.");

  for await (const file of files) {
    console.log("Parsing ", file);

    const contents = await readFileAsync(join(directory, file));
    const parsed = JSON.parse(contents.toString());
    events = events.concat(getMinimal(parsed));
  }

  return events;
};
