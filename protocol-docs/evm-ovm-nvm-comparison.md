---
description: >-
  Due to forking the OVM, we inherit a lot of their architecture. Taken from:
  https://community.optimism.io/docs/protocol/evm-comparison.html
---

# EVM/OVM/NVM Comparison

For the most part, the EVM and the OVM are pretty much identical. However, the OVM _does_ slightly diverge from the EVM in certain ways. This page acts as a living record of each of these discrepancies and their raison d'être.

### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#missing-opcodes)Missing Opcodes <a id="missing-opcodes"></a>

Some EVM opcodes don't exist in the OVM because they make no sense \(like `DIFFICULTY`\). Others don't exist because they're more trouble than they're worth \(like `SELFDESTRUCT`\). Here's a record of every missing opcode.

| EVM Opcode | Solidity Usage | Reason for Absence |
| :--- | :--- | :--- |
| `COINBASE` | `block.coinbase` | No equivalent in the OVM. |
| `DIFFICULTY` | `block.difficulty` | No equivalent in the OVM. |
| `BLOCKHASH` | `blockhash` | No equivalent in the OVM. |
| `GASPRICE` | `tx.gasprice` | No equivalent in the OVM. |
| `SELFDESTRUCT` | `selfdestruct` | It's dumb. |
| `ORIGIN` | `tx.origin` | Coming soon™. See [Account Abstraction](https://community.optimism.io/docs/protocol/evm-comparison.html#account-abstraction). |

### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#replaced-opcodes)Replaced Opcodes <a id="replaced-opcodes"></a>

Certain opcodes are banned and cannot be used directly. Instead, they must be translated into calls to the [`OVM_ExecutionManager` \(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/execution/OVM_ExecutionManager.sol)contract. **Our fork of the Solidity compiler handles this translation automatically** so you don't need to worry about this in practice.

The following opcodes must be translated into calls to the execution manager:

* `ADDRESS`
* `NUMBER`
* `TIMESTAMP`
* `CHAINID`
* `GASLIMIT`
* `REVERT`
* `SLOAD`
* `SSTORE`
* `CALL`
* `STATICCALL`
* `DELEGATECALL`
* `CREATE`
* `CREATE2`
* `EXTCODECOPY`
* `EXTCODESIZE`
* `EXTCODEHASH`
* `BALANCE`
* `CALLVALUE`

#### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#behavioral-differences-of-replaced-opcodes)Behavioral differences of replaced opcodes <a id="behavioral-differences-of-replaced-opcodes"></a>

**\#Differences for STATICCALL**

Event opcodes \(`LOG0`, `LOG1`, `LOG2`, and `LOG3`\) normally cause a revert when executed during a `STATICCALL` in the EVM. However, these opcodes _can_ be triggered within a `STATICCALL` within the OVM without causing a revert.

**\#Differences for TIMESTAMP and NUMBER**

The behavior of the `TIMESTAMP` \(`block.timestamp`\) and `NUMBER` \(`block.number`\) opcodes depends on the manner in which a transaction is added to the [`OVM_CanonicalTransactionChain` \(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/chain/OVM_CanonicalTransactionChain.sol).

For transactions that are directly added to the chain via the [`enqueue` \(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/5a7984973622d1d6e610ac98cfc206ab9a3bfe1a/packages/contracts/contracts/optimistic-ethereum/OVM/chain/OVM_CanonicalTransactionChain.sol#L257)function, `TIMESTAMP` and `NUMBER` will return the timestamp and block number of the block in which `enqueue` was called.

For transactions added to the chain by the Sequencer, the `TIMESTAMP` and `NUMBER` can be any arbitrary number that satisfies the following conditions:

1. `TIMESTAMP` and `NUMBER` on L2 may not be greater than the timestamp and block number at the time the transaction is bundled and submitted to L1.
2. `TIMESTAMP` and `NUMBER` cannot be more than [`forceInclusionPeriodSeconds` \(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/5a7984973622d1d6e610ac98cfc206ab9a3bfe1a/packages/contracts/contracts/optimistic-ethereum/OVM/chain/OVM_CanonicalTransactionChain.sol#L57)or [`forceInclusionPeriodBlocks` \(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/5a7984973622d1d6e610ac98cfc206ab9a3bfe1a/packages/contracts/contracts/optimistic-ethereum/OVM/chain/OVM_CanonicalTransactionChain.sol#L58)in the past, respectively.
3. `TIMESTAMP` and `NUMBER` must be monotonic: the timestamp of some `transaction N` **must** be greater than or equal to the timestamp of `transaction N-1`.

### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#custom-opcodes)Custom Opcodes <a id="custom-opcodes"></a>

The OVM introduces some new "opcodes" which are not present in the EVM but may be accessed via a call to the execution manager.

#### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#ovmgetnonce)`ovmGETNONCE` <a id="ovmgetnonce"></a>

```text
function ovmGETNONCE() public returns (address);
```

Returns the nonce of the calling contract.

#### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#ovmincrementnonce)`ovmINCREMENTNONCE` <a id="ovmincrementnonce"></a>

```text
function ovmINCREMENTNONCE() public;
```

Increments the nonce of the calling contract by 1. You can call this function as many times as you'd like during a transaction. As a result, you can increment your nonce as many times as you have gas to do so. Useful for implementing smart contracts that represent user accounts. See the [default contract account \(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/5a7984973622d1d6e610ac98cfc206ab9a3bfe1a/packages/contracts/contracts/optimistic-ethereum/OVM/accounts/OVM_ECDSAContractAccount.sol#L124)for an example of this.

#### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#ovmcreateeoa)`ovmCREATEEOA` <a id="ovmcreateeoa"></a>

```text
function ovmCREATEEOA(bytes32 _messageHash, uint8 _v, bytes32 _r, bytes32 _s) public;
```

Deploys the [default contract account \(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/accounts/OVM_ECDSAContractAccount.sol)on behalf of a user. Account address is determined by recovering an ECDSA signature. If the account already exists, the account will not be overwritten. See [Account Abstraction](https://community.optimism.io/docs/protocol/evm-comparison.html#native-acccount-abstraction) section for additional detail.

#### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#ovml1queueorigin)`ovmL1QUEUEORIGIN` <a id="ovml1queueorigin"></a>

```text
function ovmL1QUEUEORIGIN() public returns (uint8);
```

Returns `0` if this transaction was added to the chain by the Sequencer and `1` if the transaction was added to the chain directly by a call to [`OVM_CanonicalTransactionChain.enqueue` \(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/5a7984973622d1d6e610ac98cfc206ab9a3bfe1a/packages/contracts/contracts/optimistic-ethereum/OVM/chain/OVM_CanonicalTransactionChain.sol#L257).

#### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#ovml1txorigin)`ovmL1TXORIGIN` <a id="ovml1txorigin"></a>

```text
function ovmL1TXORIGIN() public returns (address);
```

If the result of `ovmL1QUEUEORIGIN` is `0` \(the transaction came from the Sequencer\), then this function returns the zero address \(`0x00...00`\). If the result of `ovmL1QUEUEORIGIN` is `1`, then this function returns the address that called [`OVM_CanonicalTransactionChain.enqueue` \(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/5a7984973622d1d6e610ac98cfc206ab9a3bfe1a/packages/contracts/contracts/optimistic-ethereum/OVM/chain/OVM_CanonicalTransactionChain.sol#L257)and therefore triggered this transaction.

### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#native-eth)Native ETH <a id="native-eth"></a>

Because we thought it was cool and because it's quite useful, we turned ETH into an ERC20. This means you don't need to use something like [wETH \(opens new window\)](https://weth.io/)-- ETH _is_ wETH by default. But it's also ETH. WooOooooOOOoo spooky.

#### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#using-eth-normally)Using ETH normally <a id="using-eth-normally"></a>

To use ETH normally, you can just use Solidity built-ins like `msg.value` and `address.transfer(value)`. It's the exact same thing you'd do on Ethereum.

For example, you can get your balance via:

```text
uint256 balance = address(this).balance;
```

#### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#using-eth-as-an-erc20-token)Using ETH as an ERC20 token <a id="using-eth-as-an-erc20-token"></a>

To use ETH as an ERC20 token, you can interact with the [`OVM_ETH` \(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/predeploys/OVM_ETH.sol)contract deployed to Layer 2 at the address `0x4200000000000000000000000000000000000006`.

For example, you can get your balance via:

```text
uint256 balance = ERC20(0x4200000000000000000000000000000000000006).balanceOf(address(this));
```

### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#account-abstraction)Account Abstraction <a id="account-abstraction"></a>

The OVM implements a basic form of [account abstraction \(opens new window\)](https://docs.ethhub.io/ethereum-roadmap/ethereum-2.0/account-abstraction/). In a nutshell, this means that all accounts are smart contracts \(there are no "externally owned accounts" like in Ethereum\). **This has no impact on user experience**, it's just an extension to Ethereum that gives developers a new dimension to experiment with. However, this scheme _does_ have a few minor effects on developer experience that you may want to be aware of.

#### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#compatibility-with-existing-wallets)Compatibility with existing wallets <a id="compatibility-with-existing-wallets"></a>

Our account abstraction scheme is **100% compatible with existing wallets**. For the most part, developers don't need to understand how the account abstraction scheme works under the hood. We've implemented a standard [contract account \(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/accounts/OVM_ECDSAContractAccount.sol)which remains backwards compatible with all existing Ethereum wallets out of the box. Contract accounts are automatically deployed on behalf of a user when that user sends their first transaction.

#### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#no-transaction-origin)No transaction origin <a id="no-transaction-origin"></a>

The only major restriction that our account abstraction scheme introduces is that **there is no equivalent to `tx.origin`** \(the `ORIGIN` EVM opcode\) in the OVM. Some applications use `tx.origin` to try to block certain transactions from being executed by smart contracts via:

```text
require(msg.sender == tx.origin);
```

**This will not work on Optimistic Ethereum**. You cannot tell the difference between contracts and externally owned accounts \(because externally accounts do not exist\).

#### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#upgrading-accounts)Upgrading accounts <a id="upgrading-accounts"></a>

The default [contract account \(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/accounts/OVM_ECDSAContractAccount.sol)sits behind a [proxy \(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/OVM/accounts/OVM_ProxyEOA.sol)that can be upgraded. Upgrades can be triggered by having the contract account call the `upgrade(...)` method attached to the proxy. Only the account itself can trigger this call, so it's not possible for someone else to upgrade your account.

Upgrades are disabled

Contract account upgrades are currently disabled until future notice. We're staying on the safe side and making sure that everything is working 100% with the default account before we start allowing users to play with upgrades.

### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#state-structure)State Structure <a id="state-structure"></a>

#### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#balance-field-is-always-zero)Balance field is always zero <a id="balance-field-is-always-zero"></a>

Since ETH is treated as an ERC20, the balance field of any account will always be zero. User balances are tracked as storage slots inside the ETH ERC20. If you want to determine the ETH balance for a given account, you should directly query the ETH ERC20 contract.

#### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#storage-slots-are-never-deleted)Storage slots are never deleted <a id="storage-slots-are-never-deleted"></a>

In Ethereum, setting the value of a storage slot to zero will delete the key associated with that storage slot from the trie. Because of the technical difficulty of implementing deletions within our Solidity [Merkle Trie library \(opens new window\)](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/optimistic-ethereum/libraries/trie/Lib_MerkleTrie.sol), we currently **do not** delete keys when values are set to zero. This discrepancy does not have any significant negative impact on performance. We may make an update to our Merkle Trie library that resolves this discrepancy at some point in the future.

#### [\#](https://community.optimism.io/docs/protocol/evm-comparison.html#gas-metadata-account)Gas metadata account <a id="gas-metadata-account"></a>

A special account `0x06a506A506a506A506a506a506A506A506A506A5` is used to store gas-related metadata \(cumulative gas spent, gas spent since the last epoch, etc.\). You'll see this account pop up in transaction traces and during transaction result challenges.

