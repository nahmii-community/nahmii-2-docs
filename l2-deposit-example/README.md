# Nahmii 2.0 L2 deposit example

The scripts in this example folder show how developers can interact with the Nahmii 2.0 L1 and L2. It shows how to get access to the AddressManager, retrieve addresses from some of our L1 deployed contracts and how to deposit Ethereum from L1 into L2.

## How to run the project

1. Open a command line terminal.
2. Clone the repository.
3. `cd` to the cloned project folder.
4. Fetch and switch to the 'example' branch.
5. `cd` to the example folder of your choice eg. `cd l2-deposit-example`.
6. Run `yarn` or `yarn install` to install the dependencies.
7. Update the .env file with a private key. The main address should contain Ropsten Ether.
8. Run `yarn demo` to execute the scripts to interact with the Nahmii L1 and L2.

## Configuration

These demo tests by default are connecting the live service instances of Nahmii 2.0. To run these tests against a local instance, please refer to the environment variables defined in the `./native-eth/utils.js` file.
