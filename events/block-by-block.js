"use strict";

import { parameters } from "../config/parameters.js";
import { writeFile } from "../export/file-helper.js";

const range = (start, end) => {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
};

export const tryBlockByBlock = async (contract, start, end, symbol) => {
  const blocks = range(start, end);

  let counter = 0;
  for await (const i of blocks) {
    counter++;
    console.log("%d% Block %d of %d", Math.floor((counter / (end - start)) * 100), i, end);

    const filter = contract.filters.Transfer();
    const pastEvents = await contract.queryFilter(filter, i, i);

    if (pastEvents.length) {
      console.info("Successfully imported ", pastEvents.length, " events");

      const file = parameters.eventsDownloadFilePath
        .replace(/{token}/, symbol)
        .replace(/{blockNumber}/, pastEvents[0].blockNumber);
      writeFile(file, pastEvents);
    }
  }
};
