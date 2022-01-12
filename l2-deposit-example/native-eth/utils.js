const {
    getContractFactory,
    getContractInterface,
} = require('@nahmii/contracts')
const {remove0x, Watcher} = require('@nahmii/core-utils')
const {relayXDomainMessages} = require('@nahmii/message-relayer')

const {
    Contract,
    Wallet,
    constants,
    providers,
    utils,
} = require('ethers')
const {cleanEnv, str, num} = require('envalid')

require('dotenv').config()

const env = cleanEnv(process.env, {
    L1_URL: str({default: 'https://l1.testnet.nahmii.io/'}), // An Ethereum client on the Ropsten testnet
    L2_URL: str({default: 'https://l2.testnet.nahmii.io/'}),
    // VERIFIER_URL: str({ default: 'http://localhost:8547' }),
    L1_POLLING_INTERVAL: num({default: 10}),
    L2_POLLING_INTERVAL: num({default: 10}),
    VERIFIER_POLLING_INTERVAL: num({default: 10}),
    PRIVATE_KEY: str(),
    ADDRESS_MANAGER: str(),
})

// The hardhat instance
const l1Provider = new providers.JsonRpcProvider(env.L1_URL)
l1Provider.pollingInterval = env.L1_POLLING_INTERVAL
module.exports.l1Provider = l1Provider

const l2Provider = new providers.JsonRpcProvider(env.L2_URL)
l2Provider.pollingInterval = env.L2_POLLING_INTERVAL
module.exports.l2Provider = l2Provider

// const verifierProvider = new providers.JsonRpcProvider(env.VERIFIER_URL)
// verifierProvider.pollingInterval = env.VERIFIER_POLLING_INTERVAL
// module.exports.verifierProvider = verifierProvider

// The sequencer private key which is funded on L1
const l1Wallet = new Wallet(env.PRIVATE_KEY, l1Provider)
module.exports.l1Wallet = l1Wallet

// A random private key which should always be funded with deposits = require(L1 -> L2)
// if it's using non-0 gas price
const l2Wallet = l1Wallet.connect(l2Provider)
module.exports.l2Wallet = l2Wallet

// Default gas limits
module.exports.DEFAULT_TEST_GAS_L1 = 330_000
module.exports.DEFAULT_TEST_GAS_L2 = 1_300_000

// Predeploys
const NVM_ETH_ADDRESS = '0x4200000000000000000000000000000000000006'
module.exports.NVM_ETH_ADDRESS = NVM_ETH_ADDRESS

const L2_STANDARD_BRIDGE_ADDRESS = '0x4200000000000000000000000000000000000010'
module.exports.L2_STANDARD_BRIDGE_ADDRESS = L2_STANDARD_BRIDGE_ADDRESS

const l1AddressManager = getContractFactory('Lib_AddressManager', l1Wallet)
    .attach(env.ADDRESS_MANAGER)

// Gets the L1 bridge contract
module.exports.getL1Bridge = async () => {
    const proxyBridgeAddress = await l1AddressManager.getAddress(
        'Proxy__NVM_L1StandardBridge'
    )

    const addressToUse =
        proxyBridgeAddress !== constants.AddressZero
            ? proxyBridgeAddress
            : await l1AddressManager.getAddress('NVM_L1StandardBridge')

    return new Contract(
        addressToUse,
        getContractInterface('NVM_L1StandardBridge'),
        l1Wallet
    )
}

// Gets the L2 bridge contract
module.exports.getL2Bridge = async () => {
    return new Contract(
        L2_STANDARD_BRIDGE_ADDRESS,
        getContractInterface('NVM_L2StandardBridge'),
        l2Wallet
    )
}

// Gets the L2 ETH contract
module.exports.getNvmEth = () => {
    return new Contract(
        NVM_ETH_ADDRESS,
        getContractInterface('NVM_ETH'),
        l2Wallet
    )
}

// Gets the L1 fraud verifier contract
module.exports.getL1FraudVerifier = async () => {
    const l1FraudVerifierAddress = await l1AddressManager.getAddress(
        'NVM_FraudVerifier'
    )

    return new Contract(
        l1FraudVerifierAddress,
        getContractInterface('NVM_FraudVerifier'),
        l1Provider
    )
}

// Relays all L2 => L1 messages found in a given L2 transaction.
module.exports.relayXDomainMessage = async (tx) => {
    const l1MessengerAddress = await l1AddressManager.getAddress(
        'Proxy__NVM_L1CrossDomainMessenger'
    )

    tx = await tx

    return relayXDomainMessages(
        tx.hash,
        l1MessengerAddress,
        l1Provider,
        l2Provider,
        l1Wallet
    )
}

// Initializes a watcher instance
module.exports.initWatcher = async () => {
    const l1MessengerAddress = await l1AddressManager.getAddress(
        'Proxy__NVM_L1CrossDomainMessenger'
    )
    const l2MessengerAddress = await l1AddressManager.getAddress(
        'NVM_L2CrossDomainMessenger'
    )
    return new Watcher({
        l1: {
            provider: l1Provider,
            messengerAddress: l1MessengerAddress,
        },
        l2: {
            provider: l2Provider,
            messengerAddress: l2MessengerAddress,
        }
    })
}

const Direction = Object.freeze({
    L1ToL2: 0,
    L2ToL1: 1
})
module.exports.Direction = Direction

// Waits for cross-domain transaction
module.exports.waitXDomainTransaction = async (watcher, tx, direction, fromBlock = 0) => {
    const {src, dest}
        = direction === Direction.L1ToL2
        ? {src: watcher.l1, dest: watcher.l2}
        : {src: watcher.l2, dest: watcher.l1}

    // Await it if needed
    tx = await tx

    // Get the receipt and the full transaction
    const receipt = await tx.wait()
    const fullTx = await src.provider.getTransaction(tx.hash)

    // Get the message hash which was created on the SentMessage
    const [xDomainMsgHash] = await watcher.getMessageHashesFromTx(src, tx.hash)

    // Get the transaction and receipt on the remote layer
    const remoteReceipt = await watcher.getTransactionReceipt(
        dest,
        xDomainMsgHash,
        true,
        fromBlock
    )
    const remoteTx = await dest.provider.getTransaction(
        remoteReceipt.transactionHash
    )

    return {
        tx: fullTx,
        receipt,
        remoteTx,
        remoteReceipt,
    }
}

module.exports.sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const abiCoder = new utils.AbiCoder()
module.exports.encodeSolidityRevertMessage = (_reason) => {
    return '0x08c379a0' + remove0x(abiCoder.encode(['string'], [_reason]))
}
