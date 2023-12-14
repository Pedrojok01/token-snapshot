<div align="center">
<h1><strong> Token Snapshot </strong></h1>
<h2>Create ERC20 Token Snapshots on any EVM chains!</h2>

[![Stargazers](https://img.shields.io/github/stars/Pedrojok01/token-snapshot)](https://github.com/Pedrojok01/token-snapshot/stargazers)
[![Issues](https://img.shields.io/github/issues/Pedrojok01/token-snapshot)](https://github.com/Pedrojok01/token-snapshot/issues)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Downloads per month](https://img.shields.io/npm/dm/token-snapshot)](https://img.shields.io/npm/dm/token-snapshot)

<br></br>

</div>

This command-line utility creates a snapshot of any ERC20 token in JSON or CSV format. Use your own fully synced Ethereum node or any _Ethereum node as a service_ like Infura.

- Works without a local Ethereum node.
- Automatically resumes the next time upon failure.
- Tested to work with Infura / QuickNode / Alchemy.

## Important Notes

This package is based on the little outdated <b>erc20-snapshot</b> package. Here is the list of the main modifications compared to the initial package:

- Upgraded all dependencies to their latest version;
- Switched from <b>[web3](https://docs.web3js.org/)</b> to <b>[ethers](https://docs.ethers.org/v5/)</b>;
- Switched to ES6 modules;
- Added <b>prettier</b> in addition to <b>eslint</b>;
- Group the snapshot output files into a `result` folder for clarity;

## Getting Started

```shell
npm install token-snapshot -g
```

### CLI Arguments

None. Prompts for user input and produces a configuration file on the first run.

### How to Use Token Snapshot?

Navigate to a directory where you'd like to save the token snapshot to.

```shell
cd path/to/a/directory
```

Run the program:

```shell
snapshot
```

## Configuration File / Prompt Parameters

```json
{
  "provider": "https://mainnet.infura.io/v3/<key>",
  "contractAddress": "",
  "fromBlock": 0,
  "toBlock": "latest",
  "format": "json",
  "blocksPerBatch": 2500,
  "delay": 0,
  "checkIfContract": "yes"
}
```

### provider

Enter your fully synced Ethereum node. Could be a local node or remote services like Infura.

### contractAddress

Address of your ERC20 token.

### fromBlock

The block height to scan from. To save time, enter the block number of the transaction your token was created on.

### toBlock

The block height to end the scan at.

### format

The format of the output file(s), either `CSV` or `JSON`. `both` is selected by default.

### blocksPerBatch

The number of blocks to query per batch.

If you are using remote service like Infura, keep this number relative low (2000-5000) to avoid rate limits. If you are using a dedicated Ethereum node, you can increase this number to suit your needs.

### delay

The delay (in ms) between each request in the loop. Tweak this if you are experiencing rate limit from your provider.

### checkIfContract

Checks each address to determine whether it is a smart contract or an Ethereum wallet.

## Result

You will get your snapshot files in the newly created `result/balances` folder. You can also check the detail of each block in which a tx was found in `result/tx/{token Symbol}`

## Aknowlegements

> Binod Nirvan ([@binodp](https://github.com/binodnp)):<br> > https://github.com/binodnp/erc20-snapshot
