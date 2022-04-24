# Hello-world

Building on Nahmii is smooth and fluid, just like on Ethereum with tools like Remix and Hardhat. Other tools like Truffle, Replit, etc are in the integration phase.

### Using Hardhat

#### Example 1: A simple ERC-20

This repository contains a simple ERC-20 smart contract with a public mint function and instructions on how to deploy to Nahmii 2.0 network. The files for this example can be found [here](https://github.com/nahmii-community/nahmii-2-docs/tree/examples/erc20-example).

**Requirement**

* Two L2 wallets loaded with sufficient amount of wETH, needed for the transaction.
* [Here](development-envirnoment.md#setting-up-the-development-environment), for the NodeJS version

#### Example 2: A simple greeting contract

Here's a simple greeting contract, the files can be found [here](https://github.com/nahmii-community/nahmii-2-docs/tree/examples/greeter-example).\
Note: A message can be deployed and also be changed by anyone afterwards.

**Requirements**

* A L2 wallet with wETH
* NodeJS version remains the same.

**How to run the project**

1. Open a command line terminal.
2. Run `yarn`.
3. Update the mnemonic in the `hardhat.config.js` with one that contains wETH in account 1.
4. Connect Hardhat to Nahmii in order to test the code, run `npx hardhat --network nahmii test`.
5. To interact with the smart contracts on  Nahmii, run `npx hardhat --network nahmii console`.
6. To deploy the smart contract on the Nahmii, run `npx hardhat run scripts/deploy.js --network nahmii`.
