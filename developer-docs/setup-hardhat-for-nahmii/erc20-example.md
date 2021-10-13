# ERC20 contract example

ERC20 tokens are a common type of smart contract. This repository contains a simple ERC20 smart contract with a public mint function and instructions on how to deploy them to the Nahmii 2.0 L2 network. The files for this example can be found [here](https://github.com/nahmii-community/nahmii-2-docs/tree/examples/erc20-example).

## Requirements

* NodeJS +v12
* Two L2 wallets that each have to be populated with a suffient amount of wETH.

## How to run the project

1. Open a command line terminal.
2. Run `yarn`.
3. Update the mnemonic in the `hardhat.config.js` with one that contains wETH in accounts 1 & 2.
4. To test the code, run `npx hardhat --network nahmii test`.
5. To interact with the smart contract on the Nahmii 2 L2 network run `npx hardhat --network nahmii console`.
6. To deploy the smart contract on the Nahmii 2 L2 network run `npx hardhat run scripts/deploy.js --network nahmii`.

