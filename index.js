#!/usr/bin/env node
"use strict";

import { checkConfig, config } from "./config/config.js";
import { getEventsData } from "./events/blockchain.js";
import { createBalances } from "./export/balances.js";
import { exportBalances } from "./export/export.js";
import { provider, contract } from "./web3/contract.js";

const start = async () => {
  await checkConfig();

  const format = config.format;
  const result = await getEventsData(config, provider, contract);

  console.log("Calculating balances of %s (%s)", result.name, result.symbol);
  const balances = await createBalances(result);

  console.log("Exporting balances");
  await exportBalances(result.symbol, balances, format, config, provider);
};

(async () => {
  try {
    await start();
  } catch (e) {
    console.error(e);
  }
})();
