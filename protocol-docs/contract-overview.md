---
description: >-
  Due to forking the OVM, we inherit a lot of their architecture. Taken from:
  https://community.optimism.io/docs/protocol/protocol.html
---

# Contract Overview

### Introduction <a id="introduction"></a>

Optimistic Ethereum \(OE\) is a Layer 2 scaling protocol for Ethereum applications. I.e., it makes transactions cheap. Real cheap. We aim to make transacting on Ethereum affordable and accessible to anyone.

This document is intended for anyone looking for a deeper understanding of how the protocol works 'under the hood'. If you just want to skip straight to integrating your smart contract application with OE, check out the [Developer Docs](https://community.optimism.io/docs/developers/integration.html).

Optimistic Ethereum is meant to look, feel and behave like Ethereum but cheaper and faster. For developers building on our OE, we aim to make the transition as seamless as possible. With very few exceptions, existing Solidity smart contracts can run on L2 exactly how they run on L1. Similarly, off-chain code \(ie. UIs and wallets\), should be able to interact with L2 contract with little more than an updated RPC endpoint.

### [\#](https://community.optimism.io/docs/protocol/protocol.html#system-overview)System Overview <a id="system-overview"></a>

The smart contracts in the Optimistic Ethereum \(OE\) protocol can be separated into a few key components. We will discuss each component in more detail below.

* [**Chain:**](https://community.optimism.io/docs/protocol/protocol.html#chain-contracts) Contracts on layer-1, which hold the ordering of layer-2 transactions, and commitments to the associated layer-2 state roots.
* [**Transaction result challenges:**](https://community.optimism.io/docs/protocol/protocol.html#transaction-challenge-contracts) Contracts on layer-1 which implement the process for challenging a transaction result.
* [**Execution:**](https://community.optimism.io/docs/protocol/protocol.html#execution-contracts) Contracts which implement the Optimistic Virtual Machine.
* [**Bridge:**](https://community.optimism.io/docs/protocol/protocol.html#bridge-contracts) Contracts which facilitate message passing between layer-1 and layer-2.
* [**Predeploys:**](https://community.optimism.io/docs/protocol/protocol.html#predeployed-contracts) A set of essential contracts which are deployed and available in the genesis state of the system. These contracts are similar to Ethereum's precompiles, however they are written in Solidity, and can be found at addresses prefixed with 0x42.
* [**Accounts:**](https://community.optimism.io/docs/protocol/protocol.html#account-contracts) Redeployable contracts layer-2 contracts which can represent a user and provide a form of 'account abstraction'.

![](https://community.optimism.io/assets/img/oe-arch-rc0.7b0e7105.png)Diagram created with [draw.io](https://www.diagrams.net/).  
Editable source [here](https://docs.google.com/document/d/1OObmIhuVyh5GEekqT4dd3bzO58ejSQb_rlnrBmxcNN0/edit#).

### [\#](https://community.optimism.io/docs/protocol/protocol.html#chain-contracts)Chain Contracts <a id="chain-contracts"></a>

The Chain is composed of a set of contracts running on the Ethereum mainnet. These contracts store ordered lists of:

1. An _ordered_ list of all transactions applied to the L2 state.
2. The proposed state root which would results from the application of each transaction.
3. Transactions sent from L1 to L2, which are pending inclusion in the ordered list.

The chain is composed of the following concrete contracts:

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-canonicaltransactionchain-ctc)[`OVM_CanonicalTransactionChain` \(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/chain/OVM_CanonicalTransactionChain.sol)\(CTC\) <a id="ovm-canonicaltransactionchain-ctc"></a>

The Canonical Transaction Chain \(CTC\) contract is an append-only log of transactions which must be applied to the OVM state. It defines the ordering of transactions by writing them to the `CTC:batches` instance of the Chain Storage Container. The CTC also allows any account to `enqueue()` an L2 transaction, which the Sequencer must eventually append to the rollup state.

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-statecommitmentchain-scc)[`OVM_StateCommitmentChain` \(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/chain/OVM_StateCommitmentChain.sol)\(SCC\) <a id="ovm-statecommitmentchain-scc"></a>

The State Commitment Chain \(SCC\) contract contains a list of proposed state roots which Proposers assert to be a result of each transaction in the Canonical Transaction Chain \(CTC\). Elements here have a 1:1 correspondence with transactions in the CTC, and should be the unique state root calculated off-chain by applying the canonical transactions one by one.

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-chainstoragecontainer)[`OVM_ChainStorageContainer`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/chain/OVM_ChainStorageContainer.sol) <a id="ovm-chainstoragecontainer"></a>

Provides reusable storage in the form of a "Ring Buffer" data structure, which will overwrite storage slots that are no longer needed. There are three Chain Storage Containers deployed, two are controlled by the CTC, one by the SCC.

### [\#](https://community.optimism.io/docs/protocol/protocol.html#transaction-challenge-contracts)Transaction Challenge Contracts <a id="transaction-challenge-contracts"></a>

In the previous section, we mentioned that the Chain includes a list of the _proposed_ state roots resulting from each transaction. Here we explain a bit more about how these proposals happen, and how we come to trust them.

In brief: If a proposed state root is not the correct result of executing a transaction, then a Verifier \(which is anyone running an OE 'full node'\) can initiate a transaction result challenge. If the transaction result is successfully proven to be incorrect, the Verifier will receive a reward taken from funds which a Sequencer must put up as a bond.

The challenge system is composed of the following concrete contracts:

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-fraudverifier)[`OVM_FraudVerifier`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/verification/OVM_FraudVerifier.sol) <a id="ovm-fraudverifier"></a>

The Fraud Verifier contract coordinates the entire challenge verification process. If the challenge is successful it prunes any state batches from State Commitment Chain which were published after and including the state root in question.

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-bondmanager)[`OVM_BondManager`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/verification/OVM_BondManager.sol) <a id="ovm-bondmanager"></a>

The Bond Manager contract handles deposits in the form of an ERC20 token from bonded Proposers. It also handles the accounting of gas costs spent by a Verifier during the course of a challenge. In the event of a successful challenge, the faulty Proposer's bond is slashed, and the Verifier's gas costs are refunded.

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-statetransitioner)[`OVM_StateTransitioner`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/verification/OVM_StateTransitioner.sol) <a id="ovm-statetransitioner"></a>

The State Transitioner coordinates the execution of a state transition during the evaluation of a challenge. It feeds verified input to the Execution Manager's run\(\), and controls a State Manager \(which is uniquely created for each challenge\). Once a challenge has been initialized, this contract is provided with the pre-state root and verifies that the OVM storage slots committed to the State Manager are contained in that state. This contract controls the State Manager and Execution Manager, and uses them to calculate the post-state root by applying the transaction. The Fraud Verifier can then check the correctness of a result by comparing the calculated post-state root with the proposed post-state root.

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-statetransitionerfactory)[`OVM_StateTransitionerFactory`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/verification/OVM_StateTransitionerFactory.sol) <a id="ovm-statetransitionerfactory"></a>

Used by the Fraud verifier to create a unique State Transitioner for each challenge.

### [\#](https://community.optimism.io/docs/protocol/protocol.html#execution-contracts)Execution Contracts <a id="execution-contracts"></a>

The Execution contracts implement the Optimistic Virtual Machine, or OVM. Importantly, these contracts must execute in the same deterministic manner, whether a transaction is run on Layer 2, or Layer 1 \(during a challenge\).

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-executionmanager)[`OVM_ExecutionManager`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/execution/OVM_ExecutionManager.sol) <a id="ovm-executionmanager"></a>

The Execution Manager \(EM\) is the core of our OVM implementation, and provides a sandboxed environment allowing us to execute OVM transactions deterministically on either Layer 1 or Layer 2. The EM's run\(\) function is the first function called during the execution of any transaction on L2. For each context-dependent EVM operation the EM has a function which implements a corresponding OVM operation, which will read state from the State Manager contract. The EM relies on the Safety Checker to verify that code deployed to Layer 2 does not contain any context-dependent operations.

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-safetychecker)[`OVM_SafetyChecker`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/execution/OVM_SafetyChecker.sol) <a id="ovm-safetychecker"></a>

The Safety Checker verifies that contracts deployed on L2 do not contain any "unsafe" operations. An operation is considered unsafe if it would access state variables which are specific to the environment \(ie. L1 or L2\) in which it is executed, as this could be used to "escape the sandbox" of the OVM, resulting in non-deterministic challenges. That is, an attacker would be able to challenge an honestly applied transaction. Note that a "safe" contract requires opcodes to appear in a particular pattern; omission of "unsafe" opcodes is necessary, but not sufficient.

The following opcodes are disallowed:

* `ADDRESS`
* `BALANCE`
* `ORIGIN`
* `EXTCODESIZE`
* `EXTCODECOPY`
* `EXTCODEHASH`
* `BLOCKHASH`
* `COINBASE`
* `TIMESTAMP`
* `NUMBER`
* `DIFFICULTY`
* `GASLIMIT`
* `GASPRICE`
* `CREATE`
* `CREATE2`
* `CALLCODE`
* `DELEGATECALL`
* `STATICCALL`
* `SELFDESTRUCT`
* `SELFBALANCE`
* `SSTORE`
* `SLOAD`
* `CHAINID`
* `CALLER`\*
* `CALL`\*
* `REVERT`\*

\* The `CALLER`, `CALL`, and `REVERT` opcodes are also disallowed, except in the special case that they appear as part of one of the following strings of bytecode:

1. `CALLER PUSH1 0x00 SWAP1 GAS CALL PC PUSH1 0x0E ADD JUMPI RETURNDATASIZE PUSH1 0x00 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x00 REVERT JUMPDEST RETURNDATASIZE PUSH1 0x01 EQ ISZERO PC PUSH1 0x0a ADD JUMPI PUSH1 0x01 PUSH1 0x00 RETURN JUMPDEST`
2. `CALLER POP PUSH1 0x00 PUSH1 0x04 GAS CALL`

Opcodes which are not yet assigned in the EVM are also disallowed.

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-statemanager)[`OVM_StateManager`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/execution/OVM_StateManager.sol) <a id="ovm-statemanager"></a>

The State Manager contract holds all storage values for contracts in the OVM. It can only be written to by the Execution Manager and State Transitioner. It runs on L1 during the setup and execution of a challenge. The same logic runs on L2, but has been implemented as a precompile in the L2 go-ethereum client.

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-statemanagerfactory)[`OVM_StateManagerFactory`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/execution/OVM_StateManagerFactory.sol) <a id="ovm-statemanagerfactory"></a>

The State Manager Factory is called by a State Transitioner's init code, to create a new State Manager for use in the challenge process.

### [\#](https://community.optimism.io/docs/protocol/protocol.html#bridge-contracts)Bridge Contracts <a id="bridge-contracts"></a>

The Bridge contracts implement the functionality required to pass messages between layer 1 and layer 2.

The Bridge is composed of the following concrete contracts:

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-l1crossdomainmessenger)[`OVM_L1CrossDomainMessenger`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/bridge/messaging/OVM_L1CrossDomainMessenger.sol) <a id="ovm-l1crossdomainmessenger"></a>

The L1 Cross Domain Messenger \(L1xDM\) contract sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-l2crossdomainmessenger)[`OVM_L2CrossDomainMessenger`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/bridge/messaging/OVM_L2CrossDomainMessenger.sol) <a id="ovm-l2crossdomainmessenger"></a>

The L2 Cross Domain Messenger \(L2xDM\) contract sends messages from L2 to L1, and is the entry point for L2 messages sent via the L1 Cross Domain Messenger.

### [\#](https://community.optimism.io/docs/protocol/protocol.html#predeployed-contracts)Predeployed Contracts <a id="predeployed-contracts"></a>

"Predeploys" are a set of essential L2 contracts which are deployed and available in the genesis state of the system. These contracts are similar to Ethereum's precompiles, however they are written in Solidity, and can be found in the OVM at addresses prefixed with 0x42.

Looking up predeploys is available in the Solidity library [`Lib_PredeployAddresses` \(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/master/packages/contracts/contracts/optimistic-ethereum/libraries/constants/Lib_PredeployAddresses.sol)as well as in the `@eth-optimism/contracts` package as `predeploys` export.

The following concrete contracts are predeployed:

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-deployerwhitelist)[`OVM_DeployerWhitelist`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/predeploys/OVM_DeployerWhitelist.sol) <a id="ovm-deployerwhitelist"></a>

The Deployer Whitelist is a temporary predeploy used to provide additional safety during the initial phases of our mainnet roll out. It is owned by the Optimism team, and defines accounts which are allowed to deploy contracts on Layer 2. The Execution Manager will only allow an ovmCREATE or ovmCREATE2 operation to proceed if the deployer's address whitelisted.

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-eth)[`OVM_ETH`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/predeploys/OVM_ETH.sol) <a id="ovm-eth"></a>

The ETH predeploy provides an ERC20 interface for ETH deposited to Layer 2. Note that unlike on Layer 1, Layer 2 accounts do not have a balance field.

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-l1messagesender)[`OVM_L1MessageSender`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/predeploys/OVM_L1MessageSender.sol) <a id="ovm-l1messagesender"></a>

The L1MessageSender is a predeployed contract running on L2. During the execution of cross domain transaction from L1 to L2, it returns the address of the L1 account \(either an EOA or contract\) which sent the message to L2 via the Canonical Transaction Chain's `enqueue()` function. This contract exclusively serves as a getter for the `ovmL1TXORIGIN` operation. This is necessary because there is no corresponding EVM opcode which the optimistic solidity compiler could replace with a call to the ExecutionManager's `ovmL1TXORIGIN()` function. That is, if a contract on L2 wants to know which L1 address initiated a call on L2, the way to do it is by calling `OVM_L1MessageSender.ovmL1TXORIGIN()`.

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-l2tol1messagepasser)[`OVM_L2ToL1MessagePasser`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/predeploys/OVM_L2ToL1MessagePasser.sol) <a id="ovm-l2tol1messagepasser"></a>

The L2 to L1 Message Passer is a utility contract which facilitate an L1 proof of the of a message on L2. The L1 Cross Domain Messenger performs this proof in its \_verifyStorageProof function, which verifies the existence of the transaction hash in this contract's `sentMessages` mapping.

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-sequencerentrypoint)[`OVM_SequencerEntrypoint`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/predeploys/OVM_SequencerEntrypoint.sol) <a id="ovm-sequencerentrypoint"></a>

The Sequencer Entrypoint is a predeploy which, despite its name, can in fact be called by any account. It accepts a more efficient compressed calldata format, which it decompresses and encodes to the standard EIP155 transaction format. This contract is the implementation referenced by the Proxy Sequencer Entrypoint, thus enabling the Optimism team to upgrade the decompression of calldata from the Sequencer.

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-l2standardbridge)[`OVM_L2StandardBridge`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/master/packages/contracts/contracts/optimistic-ethereum/OVM/bridge/tokens/OVM_L2StandardBridge.sol) <a id="ovm-l2standardbridge"></a>

The L2 part of the Standard Bridge. Responsible for finalising deposits from L1 and initiating withdrawals from L2 of ETH and compliant ERC20s. See [Standard Bridge](https://community.optimism.io/docs/developers/bridging.html#the-standardtm-bridge) for details.

### [\#](https://community.optimism.io/docs/protocol/protocol.html#account-contracts)Account Contracts <a id="account-contracts"></a>

OVM Account contracts are redeployable contracts layer-2 contracts which can represent a user and provide a form of 'account abstraction'.

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-proxyeoa)[`OVM_ProxyEOA`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/accounts/OVM_ProxyEOA.sol) <a id="ovm-proxyeoa"></a>

The Proxy EOA contract uses a delegate call to execute the logic in an implementation contract. In combination with the logic implemented in the ECDSA Contract Account, this enables a form of upgradable 'account abstraction' on layer 2.

#### [\#](https://community.optimism.io/docs/protocol/protocol.html#ovm-ecdsacontractaccount)[`OVM_ECDSAContractAccount`\(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/accounts/OVM_ECDSAContractAccount.sol) <a id="ovm-ecdsacontractaccount"></a>

The ECDSA Contract Account contract can be used as the implementation for a ProxyEOA deployed by the ovmCREATEEOA operation. It enables backwards compatibility with Ethereum's Layer 1, by providing eth\_sign and EIP155 formatted transaction encodings.
