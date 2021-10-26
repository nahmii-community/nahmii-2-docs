# Greeting contract example

This is a very simple greeting smart contract. A message can be set on deployment and changed by anyone afterwards. The files for this example can be found [here](https://github.com/nahmii-community/nahmii-2-docs/tree/examples/greeter-example).

## Requirements

* NodeJS +v12
* A L2 wallet populated with wETH.

## How to run the project

1. Open a command line terminal.
2. Run `yarn`.
3. Update the mnemonic in the `hardhat.config.js` with one that contains wETH in account 1.
4. To connect HardHat to the Nahmii 2 L2 network and test the code, run `npx hardhat --network nahmii test`.
5. To interact with the smart contracts on the Nahmii 2 L2 network run `npx hardhat --network nahmii console`.
6. To deploy the smart contract on the Nahmii 2 L2 network run `npx hardhat run scripts/deploy.js --network nahmii`.

