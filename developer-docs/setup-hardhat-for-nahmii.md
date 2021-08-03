# Setup Hardhat for Nahmii

## Configuring a project to run on Nahmii 2.0

To compile the correct bytecode to work with the Nahmii virtual machine, the hardhat-ovm dependency is required due to the differences between certain opcodes in the EVM and the NVM.

1. Install the OVM hardhat plugin.

```javascript
yarn add @eth-optimism/hardhat-ovm
```

1. Edit `hardhat.config.js` to use the OVM package.

```javascript
// hardhat.config.js
require("@nomiclabs/hardhat-waffle");
require('@eth-optimism/hardhat-ovm')

...
```

1. In the same file, add `nahmii` to the list of networks:

```javascript
...

module.exports = {
  solidity: "0.7.6",
  networks: {
    nahmii: {
      url: 'https://l2.testnet.nahmii.io/',
      accounts: { mnemonic: 'test test test test test test test test test test test junk' },
      gasPrice: 15000000,
      ovm: true
    }
  }
};
```

1. To test contracts on the live Nahmii L2, compile it with hardhat:

```text
npx hardhat --network nahmii test
```

1. To interact with the smart contracts manually, use the console. The JavaScript console can be ran with the following command:

```text
npx hardhat --network nahmii console
```

