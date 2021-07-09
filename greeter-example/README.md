# Nahmii 2.0 greeting contract example

This is a very simple greeting smart contract.
A message can be set on deployment and changed by anyone afterwards.

## How to run the project

1. Open a command line terminal.
2. Run `yarn`.
3. To connect hardhat to the Nahmii 2 L2 network and test the code, run `npx hardhat --network nahmii test`.
4. To interact with the smart contracts on the Nahmii 2 L2 network run `npx hardhat --network nahmii console`.

## Configuring a project to run with Nahmii 2

To compile the correct bytecode to work with the Nahmii virtual machine, the hardhat-ovm dependency is required due to a difference between certain opcodes between the EVM and the NVM.

1. Install the OVM hardhat plugin.

```js
yarn add @eth-optimism/hardhat-ovm
```

2. Edit `hardhat.config.js` to use the OVM package.

```js
// hardhat.config.js
require("@nomiclabs/hardhat-waffle");
require('@eth-optimism/hardhat-ovm')

...
```

3. In the same file, add `nahmii` to the list of networks:

```js
...

module.exports = {
  solidity: "0.7.6",
  networks: {
    nahmii: {
      url: 'https://l2.testnet.nahmii.io/',
      accounts: {mnemonic: 'test test test test test test test test test test test junk'},
      gasPrice: 15000000,
      ovm: true
    }
  }
};
```

4. To test contracts on the live Nahmii l2, compile it with hardhat:

```
npx hardhat --network nahmii test
```

5. To interact with the smart contracts manually, use the console. The JavaScript console can be ran with the following command:

```
npx hardhat --network nahmii console
```