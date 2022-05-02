# Development-Envirnoment

If you are an Ethereum developer, you're also a Nahmii developer, as the tools used on Ethereum are supported on Nahmii; Remix, Web3js, OpenZeppelin, Hardhat, etc. Make the switch to Nahmii's RPC and get started.

Nahmii Test Network connects with Ethereum's **Rospten Testnet,** and all network-related details can be found [here](get-started.md#connecting-metamask).

Setup [Metamask Wallet](get-started.md#connect-manually-via-metamask)

Deploy your contracts on Nahmii using&#x20;

* [Hardhat](development-envirnoment.md#via-hardhat)
* [Remix](development-envirnoment.md#via-remix)

### Setting up the development environment

#### Via Hardhat

There are a few requirements, please install the following to get started:

1. Node.js v12+ LTS and npm
2. Git

* Install the NVM Hardhat plugin.

```
yarn add @nahmii/hardhat-nvm 
```

* Edit `hardhat.config.js` to use the NVM package.

```
// hardhat.config.js
require("@nomiclabs/hardhat-waffle");
require('@nahmii/hardhat-nvm')

...
```

* In the file, add `nahmii` to the list of networks.\
  Note: Update the accounts fields to fit your personal setup.

```
...

module.exports = {
  solidity: "0.7.6",
  networks: {
    nahmii: {
      url: 'https://l2.testnet.nahmii.io/',
      accounts: { mnemonic: 'test test test test test test test test test test test junk' },
      gasPrice: 15000000,
      nvm: true
    }
  }
};
```

* To test contracts on the live Nahmii L2, compile it with HardHat.

```
npx hardhat --network nahmii test
```

* To interact with the smart contracts manually, use the console. The JavaScript console can be run with the following command.

```
npx hardhat --network nahmii console
```

* To deploy to Nahmii, write a deploy script for HardHat ([https://hardhat.org/guides/deploying.html](https://hardhat.org/guides/deploying.html)) and run the following command.

```
npx hardhat --network nahmii scripts/deploy.js
```

#### Via Remix

Remix is an online IDE to develop smart contracts

**Configuration**&#x20;

1. In a new remix workspace, navigate to the `PLUGIN MANAGER`.
2. Activate the `OPTIMISM COMPILER`.
3. A new compiler tab will show up. Select a Solidity file to compile. Be sure to select the correct compiler version for your smart contract.

### Running a Node

