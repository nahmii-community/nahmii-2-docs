# Nahmii 2.0 ERC20 contract example

ERC20 tokens are a common type of smart contract. 
This repository contains a simple ERC20 smart contract with a public mint function and instructions on how to deploy them to the Nahmii 2.0 L2 network.

## How to run the this project

1. Open a command line terminal.
2. Clone the repository.
3. `cd` to the cloned project folder.
4. Fetch and switch to the 'example' branch.
5. `cd` to the example folder of your choice eg. `cd erc20-example`.
6. Run `yarn` or `yarn install`.
7. Update the mnemonic in the `hardhat.config.js` file, with the one that contains wETH, account 1 & 2, for example, the metamask mnemonic.
8. To test the code, run `npx hardhat --network nahmii test`.
9. To interact with the smart contract on the Nahmii 2 L2 network run `npx hardhat --network nahmii console`.
10. To deploy the smart contract on the Nahmii 2 L2 network run `npx hardhat --network run nahmii scripts/deploy.js`.
