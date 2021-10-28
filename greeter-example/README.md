# Nahmii 2.0 greeting contract example

This is a very simple greeting smart contract.
A message can be set on deployment and changed by anyone afterwards.

## How to run the example project

1. Open a command line terminal.
2. Clone the repository.
3. `cd` to the cloned project folder.
4. Fetch and switch to the 'example' branch.
5. `cd` to the example folder of your choice eg. `cd greeter-example`.
6. Run `yarn` or `yarn install`.
7. Update the mnemonic in the `hardhat.config.js` file with the one that contains wETH, account 1.
8. To test the code, run `npx hardhat --network nahmii test`.
9. To interact with the smart contract on the Nahmii 2 L2 network run `npx hardhat --network nahmii console`.
10. To deploy the smart contract on the Nahmii 2 L2 network run `npx hardhat --network nahmii run scripts/deploy.js`.
