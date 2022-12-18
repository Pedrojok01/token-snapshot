import { ethers } from "ethers";
import Enumerable from "linq";

import { getConfig } from "./config.js";
import { parseFile, writeFile } from "./file-helper.js";
import { parameters } from "./parameters.js";

const web3 = new ethers.providers.JsonRpcProvider((getConfig() || {}).provider || "http://localhost:8545");

const findTypeFromCache = (cache, wallet) => {
  if (cache && cache.length) {
    for (const entry of cache) {
      if (entry.wallet === wallet) {
        return entry.type;
      }
    }
  }

  return null;
};

export const addType = async (balances) => {
  if (getConfig().checkIfContract.toLowerCase() !== "yes") {
    return balances;
  }

  let counter = 0;
  const cache = await parseFile(parameters.knownTypes);

  for await (const balance of balances) {
    counter++;
    let type = findTypeFromCache(cache, balance.wallet);
    console.log("%d of %d. Determining if %s is a contract.", counter, balances.length, balance.wallet);

    if (!type) {
      type = "wallet";

      const code = await web3.getCode(balance.wallet);

      if (code != "0x") {
        type = "contract";
        console.log("✓", balance.wallet, "is a contract.");
      }
    }

    balance.type = type;
  }

  const knownTypes = Enumerable.from(balances)
    .select((x) => {
      return { wallet: x.wallet, type: x.type };
    })
    .toArray();

  await writeFile(parameters.knownTypes, knownTypes);

  return Enumerable.from(balances)
    .orderBy((x) => x.type)
    .thenByDescending((x) => parseFloat(x.balance))
    .toArray();
};
