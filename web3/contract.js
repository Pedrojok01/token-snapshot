"use strict";

import { Contract, providers } from "ethers";

import { config } from "../config/config.js";
import { parameters } from "../config/parameters.js";

const contractAddress = (config || {}).contractAddress || "";

export const provider = new providers.JsonRpcProvider((config || {}).provider || "http://localhost:8545");
export const contract = new Contract(contractAddress, parameters.abi, provider);
