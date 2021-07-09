const {
  l1Wallet,
  l2Wallet,
  getAddressManager,
  getGateway,
  getOvmEth,
  sleep
} = require('./utils')

const ethers = require('ethers')

const run = async () => {
  const addressManager = getAddressManager(l1Wallet)
  const gateway = await getGateway(l1Wallet, addressManager)

  const amount = ethers.utils.parseEther('0.01')

  console.log(`L2 balance(${l2Wallet.address}) before deposit: ${(await l2Wallet.getBalance()).toString()}`)
  const depositTx = await gateway.deposit({
    value: amount
  })
  console.log(`deposit tx hash by wallet ${l2Wallet.address}: ${depositTx.hash}`)

  await sleep(10000)
  console.log(`L2 balance(${l2Wallet.address}) after deposit: ${(await l2Wallet.getBalance()).toString()}`)

  const ovmEth = getOvmEth(l2Wallet)

  const other = ethers.Wallet.createRandom().connect(l2Wallet.provider)
  const transferTx = await ovmEth.transfer(other.address, amount)
  console.log(`L2 transfer tx hash by wallet ${l2Wallet.address}: ${transferTx.hash}`)

  console.log(`L2 balance(${other.address}) after transfer: ${(await other.getBalance()).toString()}`)

  const withdrawnAmount = ethers.utils.parseEther('0.0095')
  ovmEth.connect(other).withdraw(withdrawnAmount)

  await sleep(10000)

  const l1BalanceAfter = await other
      .connect(l1Wallet.provider)
      .getBalance()
  console.log(`L1 balance(${other.address}) after withdrawal: ${l1BalanceAfter.toString()}`)
}

run()
