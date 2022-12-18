"use strict";
import BigNumber from "bignumber.js";
import enumerable from "linq";

export const createBalances = async (data) => {
  const balances = new Map();
  const closingBalances = [];

  const setDeposits = (event) => {
    const wallet = event.to;

    let deposits = (balances.get(wallet) || {}).deposits || new BigNumber(0);
    const withdrawals = (balances.get(wallet) || {}).withdrawals || new BigNumber(0);

    if (event.value) {
      deposits = deposits.plus(new BigNumber(event.value));
      balances.set(wallet, { deposits, withdrawals });
    }
  };

  const setWithdrawals = (event) => {
    const wallet = event.from;

    const deposits = (balances.get(wallet) || {}).deposits || new BigNumber(0);
    let withdrawals = (balances.get(wallet) || {}).withdrawals || new BigNumber(0);

    if (event.value) {
      withdrawals = withdrawals.plus(new BigNumber(event.value));
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

    const balance = value.deposits.minus(value.withdrawals);
    if (balance > 0) {
      closingBalances.push({
        wallet: key,
        balance: balance.div(10 ** parseInt(data.decimals)).toFixed(18)
      });
    }
  }

  return enumerable
    .from(closingBalances)
    .orderByDescending((x) => parseFloat(x.balance))
    .toArray();
};
