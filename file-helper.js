"use strict";

import fs from "fs";
import path from "path";
import { promisify } from "util";

const existsAsync = promisify(fs.exists);
const makeDirectoryAsync = promisify(fs.mkdir);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const ensureDirectoryExists = async (directory) => {
  try {
    await makeDirectoryAsync(directory, { recursive: true });
  } catch (err) {
    console.log(err);
  }
};

export const ensureDirectory = async (directory) => {
  ensureDirectoryExists(directory);
};

export const writeFile = async (filePath, data) => {
  await ensureDirectoryExists(path.dirname(filePath.toString()));
  await writeFileAsync(filePath, JSON.stringify(data, null, 2));
};

export const parseFile = async (filePath) => {
  if (await existsAsync(filePath.toString())) {
    const contents = await readFileAsync(filePath);
    return JSON.parse(contents.toString());
  }

  return null;
};
