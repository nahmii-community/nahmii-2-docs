const {
  getContractFactory,
  getContractInterface,
} = require('@nahmii/contracts')
const { remove0x, Watcher } = require('@nahmii/core-utils')
const {
  Contract,
  Wallet,
  constants,
  providers,
  BigNumberish,
  BigNumber,
  utils,
} = require('ethers')
const { cleanEnv, str, num } = require('envalid')

module.exports.GWEI = BigNumber.from(1e9)

const env = cleanEnv(process.env, {
  L1_URL: str({ default: 'https://l1.testnet.nahmii.io/' }),
  L2_URL: str({ default: 'https://l2.testnet.nahmii.io/' }),
  VERIFIER_URL: str({ default: 'http://localhost:8547' }),
  L1_POLLING_INTERVAL: num({ default: 10 }),
  L2_POLLING_INTERVAL: num({ default: 10 }),
  VERIFIER_POLLING_INTERVAL: num({ default: 10 }),
  PRIVATE_KEY: str({
    default:
      '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
  }),
  ADDRESS_MANAGER: str({
    default: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  }),
})

// The hardhat instance
const l1Provider = new providers.JsonRpcProvider(env.L1_URL)
l1Provider.pollingInterval = env.L1_POLLING_INTERVAL
module.exports.l1Provider = l1Provider

const l2Provider = new providers.JsonRpcProvider(env.L2_URL)
l2Provider.pollingInterval = env.L2_POLLING_INTERVAL
module.exports.l2Provider = l2Provider

const verifierProvider = new providers.JsonRpcProvider(env.VERIFIER_URL)
verifierProvider.pollingInterval = env.VERIFIER_POLLING_INTERVAL
module.exports.verifierProvider = verifierProvider

// The sequencer private key which is funded on L1
const l1Wallet = new Wallet(env.PRIVATE_KEY, l1Provider)
module.exports.l1Wallet = l1Wallet

// A random private key which should always be funded with deposits = require(L1 -> L2)
// if it's using non-0 gas price
module.exports.l2Wallet = l1Wallet.connect(l2Provider)

// Predeploys
module.exports.PROXY_SEQUENCER_ENTRYPOINT_ADDRESS =
  '0x4200000000000000000000000000000000000004'

const NVM_ETH_ADDRESS = '0x4200000000000000000000000000000000000006'
module.exports.NVM_ETH_ADDRESS = NVM_ETH_ADDRESS

module.exports.getAddressManager = (provider) => {
  return getContractFactory('Lib_AddressManager')
    .connect(provider)
    .attach(env.ADDRESS_MANAGER)
}

// Gets the gateway using the proxy if available
module.exports.getGateway = async (wallet, AddressManager) => {
  const l1GatewayInterface = getContractInterface('NVM_L1ETHGateway')
  const ProxyGatewayAddress = await AddressManager.getAddress(
    'Proxy__NVM_L1ETHGateway'
  )
  const addressToUse =
    ProxyGatewayAddress !== constants.AddressZero
      ? ProxyGatewayAddress
      : await AddressManager.getAddress('NVM_L1ETHGateway')

  const NVM_L1ETHGateway = new Contract(
    addressToUse,
    l1GatewayInterface,
    wallet
  )

  return NVM_L1ETHGateway
}

module.exports.getNvmEth = (wallet) => {
  const NVM_ETH = new Contract(
    NVM_ETH_ADDRESS,
    getContractInterface('NVM_ETH'),
    wallet
  )

  return NVM_ETH
}

module.exports.sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const abiCoder = new utils.AbiCoder()
module.exports.encodeSolidityRevertMessage = (_reason) => {
  return '0x08c379a0' + remove0x(abiCoder.encode(['string'], [_reason]))
}
