"use strict";
import { BigNumber } from "ethers";
import enumerable from "linq";

export const createBalances = async (data) => {
  const balances = new Map();
  const closingBalances = [];

  const setDeposits = (event) => {
    const wallet = event.to;

    let deposits = (balances.get(wallet) || {}).deposits || BigNumber.from(0);
    const withdrawals = (balances.get(wallet) || {}).withdrawals || BigNumber.from(0);

    if (event.value) {
      deposits = deposits.add(BigNumber.from(event.value));
      balances.set(wallet, { deposits, withdrawals });
    }
  };

  const setWithdrawals = (event) => {
    const wallet = event.from;

    const deposits = (balances.get(wallet) || {}).deposits || BigNumber.from(0);
    let withdrawals = (balances.get(wallet) || {}).withdrawals || BigNumber.from(0);

    if (event.value) {
      withdrawals = withdrawals.add(BigNumber.from(event.value));
      balances.set(wallet, { deposits, withdrawals });
    }
  };

  for (const event of data.events) {
    setDeposits(event);
    setWithdrawals(event);
  }

  for (const [key, value] of balances.entries()) {
    if (key === "0x0000000000000000000000000000000000000000") {
      continue;
    }

    const balance = value.deposits.sub(value.withdrawals);
    if (balance > 0) {
      closingBalances.push({
        wallet: key,
        balance: (Number(balance) / 10 ** parseInt(data.decimals)).toFixed(parseInt(data.decimals)).toString()
      });
    }
  }

  return enumerable
    .from(closingBalances)
    .orderByDescending((x) => parseFloat(x.balance))
    .toArray();
};
