"use strict";
import path from "path";

import { createObjectCsvWriter } from "csv-writer";

import { ensureDirectory, writeFile } from "./file-helper.js";
import { parameters } from "./parameters.js";
import { addType } from "./wallet-type.js";

export const exportBalances = async (symbol, balances, format) => {
  const withType = await addType(balances);

  const writeCsv = () => {
    const file = parameters.outputFileNameCSV.replace(/{token}/, symbol);
    ensureDirectory(path.dirname(file));

    const writer = createObjectCsvWriter({
      path: file,
      header: [
        { id: "wallet", title: "Wallet" },
        { id: "balance", title: "Balance" },
        { id: "type", title: "Type" }
      ]
    });

    console.log("Exporting CSV");
    writer.writeRecords(withType).then(() => console.log("CSV export done!"));
  };

  if (["csv", "both"].indexOf(format.toLowerCase()) > -1) {
    writeCsv();

    if (format.toLowerCase() === "csv") {
      return;
    }
  }

  console.log("Exporting JSON");
  await writeFile(parameters.outputFileNameJSON.replace(/{token}/g, symbol), withType);
  console.log("JSON export done!");
};
