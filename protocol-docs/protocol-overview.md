---
description: >-
  Due to forking the NVM, we inherit a lot of their architecture. Taken from:
  https://community.optimism.io/docs/protocol/protocol.html
---

# Protocol Overview

### Introduction <a id="introduction"></a>

Nahmii is a Layer 2 scaling protocol for Ethereum applications. I.e., it makes transactions cheap. Real cheap. We aim to make transacting on Ethereum affordable and accessible to anyone.

This document is intended for anyone looking for a deeper understanding of how the protocol works 'under the hood'. If you just want to skip straight to integrating your smart contract application with Nahmii, a good place to start is to check out [Optimism's Developer Docs](https://community.optimism.io/docs/developers/integration.html).

Nahmii is meant to look, feel and behave like Ethereum but cheaper and faster. For developers building on the Nahmii L2, we aim to make the transition as seamless as possible. With very few exceptions, existing Solidity smart contracts can run on L2 exactly how they run on L1. Similarly, off-chain code \(ie. UIs and wallets\), should be able to interact with L2 contract with little more than an updated RPC endpoint.

### Opcode support <a id="introduction"></a>

Because of the security mechanisms built into the NVM a subset of Smart contract opcodes are not supported in Nahmii. 

Now, as most smart contracts are written in the Solidity programming language this is usually manageable. Compliant bytecode is generated as output using [Optimism's modified Solidity compiler](https://github.com/ethereum-optimism/solc-bin) to compile smart contracts. The bytecode contains replacements for most unsupported EVM opcodes.

Compilation with the modified compiler is facilitated by HardHat plugin [@nahmii/hardhat-nvm](https://www.npmjs.com/package/@nahmii/hardhat-nvm). 

Below is the set of opcodes that are disallowed in contract bytecode deployed to the Nahmii L2:

* `ADDRESS`
* `BALANCE`
* `BLOCKHASH`
* `CALLCODE`
* `CALLER`\*
* `CALL`\*
* `CHAINID`
* `COINBASE`
* `CREATE2`
* `CREATE`
* `DELEGATECALL`
* `DIFFICULTY`
* `EXTCODECOPY`
* `EXTCODEHASH`
* `EXTCODESIZE`
* `GASLIMIT`
* `GASPRICE`
* `NUMBER`
* `ORIGIN`
* `REVERT`\*
* `SELFBALANCE`
* `SELFDESTRUCT`
* `SLOAD`
* `SSTORE`
* `STATICCALL`
* `TIMESTAMP`

\* The `CALLER`, `CALL`, and `REVERT` opcodes are also disallowed, except in the special case that they appear as part of one of the following strings of bytecode:

1. `CALLER PUSH1 0x00 SWAP1 GAS CALL PC PUSH1 0x0E ADD JUMPI RETURNDATASIZE PUSH1 0x00 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x00 REVERT JUMPDEST RETURNDATASIZE PUSH1 0x01 EQ ISZERO PC PUSH1 0x0a ADD JUMPI PUSH1 0x01 PUSH1 0x00 RETURN JUMPDEST`

2. `CALLER POP PUSH1 0x00 PUSH1 0x04 GAS CALL`

Opcodes which are not yet assigned in the EVM are also disallowed.
