"use strict";

import { readdir, exists } from "fs";
import { promisify } from "util";

import Enumerable from "linq";

import { parameters } from "../parameters.js";
const readdirAsync = promisify(readdir);
const folderExistsAsync = promisify(exists);

export const getFiles = async (symbol) => {
  const downloadFolder = parameters.eventsDownloadFolder.replace("{token}", symbol);

  if (!(await folderExistsAsync(downloadFolder))) {
    return 0;
  }
  const files = await readdirAsync(downloadFolder);

  return Enumerable.from(files)
    .select((x) => {
      return parseInt(x.replace(".json", "")) || 0;
    })
    .max((x) => x);
};
