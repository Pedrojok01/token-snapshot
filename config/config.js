"use strict";

import fs from "fs";
import { promisify } from "util";

import inquirer from "inquirer";

import { parameters } from "./parameters.js";

const writeFileAsync = promisify(fs.writeFile);
const fileExists = promisify(fs.exists);

export const checkConfig = async () => {
  const exists = await fileExists(parameters.configFileName);

  if (exists) {
    return;
  }

  const config = await inquirer.prompt(parameters.configQuestions);
  await writeFileAsync("./snapshot.config.json", JSON.stringify(config, null, 2));
  console.info("Configuration file created successfully. Please run the program again.");
  process.exit();
};

const getConfig = () => {
  try {
    const contents = fs.readFileSync(parameters.configFileName);
    return JSON.parse(contents.toString());
  } catch (e) {
    console.error("No configuration file found.");
  }
};

export const config = getConfig();
