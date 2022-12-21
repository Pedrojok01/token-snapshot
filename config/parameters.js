"use strict";

import path from "path";

import { abi } from "../web3/abi.js";

export const parameters = {
  abi: abi,
  configFileName: path.join(process.cwd(), "snapshot.config.json"),
  configQuestions: [
    {
      type: "input",
      name: "provider",
      message: "Enter the URL of web3 provider",
      default: "http://localhost:8545"
    },
    {
      type: "input",
      name: "contractAddress",
      message: "Enter your contract address",
      default: "Enter your contract address"
    },
    {
      type: "input",
      name: "fromBlock",
      message: "Enter the block number to start from",
      default: "0"
    },
    {
      type: "input",
      name: "toBlock",
      message: "Enter the block number to end at",
      default: "latest"
    },
    {
      type: "input",
      name: "blocksPerBatch",
      message: "Blocks per batch",
      default: 2500
    },
    {
      type: "input",
      name: "delay",
      message: "Delay per iteration (ms)",
      default: 0
    },
    {
      type: "input",
      name: "format",
      message: "Format -> csv, json, both",
      default: "both"
    },
    {
      type: "input",
      name: "checkIfContract",
      message: "Check addresses if they are contracts or wallets?",
      default: "yes"
    }
  ],
  knownTypes: path.join(process.cwd(), "./result/.cache/known-types.json"),
  outputFileNameCSV: path.join(process.cwd(), "./result/balances/{token}.csv"),
  outputFileNameJSON: path.join(process.cwd(), "./result/balances/{token}.json"),
  eventsDownloadFolder: path.join(process.cwd(), "./result/tx/{token}/"),
  eventsDownloadFilePath: path.join(process.cwd(), "./result/tx/{token}/{blockNumber}.json")
};
