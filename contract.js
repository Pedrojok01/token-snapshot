"use strict";

import { ethers } from "ethers";

import { getConfig } from "./config.js";
import { parameters } from "./parameters.js";

const config = getConfig();

const web3 = new ethers.providers.JsonRpcProvider((config || {}).provider || "http://localhost:8545");
const contractAddress = (config || {}).contractAddress || "";

export const contract = new ethers.Contract(contractAddress, parameters.abi, web3);
