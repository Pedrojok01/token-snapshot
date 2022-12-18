#!/usr/bin/env node
"use strict";

import { createBalances } from "./balances.js";
import { checkConfig, getConfig } from "./config.js";
import { getEventsData } from "./events/blockchain.js";
import { exportBalances } from "./export.js";

const start = async () => {
  await checkConfig();
  const format = getConfig().format;
  const result = await getEventsData();

  console.log("Calculating balances of %s (%s)", result.name, result.symbol);
  const balances = await createBalances(result);

  console.log("Exporting balances");
  await exportBalances(result.symbol, balances, format);
};

(async () => {
  try {
    await start();
  } catch (e) {
    console.error(e);
  }
})();
