# nahmii-2-docs

## About nahmii 2.0

nahmii 2.0 is a layer 2 for Ethereum built around the nahmii Virtual Machine, nVM. This upgraded version of nahmii provides generalised smart contract support and full composability between them. nahmii leverages patent-pending state pool technology which gives unprecedented scalability. This makes nahmii the only commercially viable scaling solution for Ethereum.

## Connecting to nahmii 2.0

The current testnet iteration of nahmii 2.0 works with both a private instance of Ethereum and a L2 network. It is thus required to connect to two RPC networks.

### Network details

L1 testnet
Network name: nahmii 2.0 L1 testnet
RPC URL: https://l1.testnet.nahmii.io/
ChainID: 1
Symbol: ETH
Block explorer URL:

L2 testnet
Network name: nahmii 2.0 L2 testnet
RPC URL: https://l2.testnet.nahmii.io/
ChainID: 420
Symbol: ETH
Block explorer URL:

### Connect manually via MetaMask

1. Open the MetaMask brwoser extension.
2. Click on the network name.
3. When the networks window pops up, click on 'Custom RPC'.
4. A new window will popup where you can fill in the connection details. Fill in the details provided above for the first network and click save.
5. Do this again for the second network listed above.

## Nahmii 2.0 Meta contracts L1 <-> L2

Nahmii 2.0 provides a number of contracts on L1 to interact with the L2 and vica versa. The meta data of these contracts can be found [here](https://meta.testnet.nahmii.io/addresses.json).

The main contract for developers is the AddressManager. The AddressManager provides easy accesss to all the other contracts and exposes their addresses. 