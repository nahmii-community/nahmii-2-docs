const {
    l1Wallet,
    l2Wallet,
    getL1Bridge,
    getL2Bridge,
    getNvmEth,
    getL1FraudVerifier,
    relayXDomainMessage,
    initWatcher,
    Direction,
    waitXDomainTransaction,
    sleep,
    DEFAULT_TEST_GAS_L1,
    DEFAULT_TEST_GAS_L2,
} = require('./utils')

const ethers = require('ethers')

const run = async () => {
    const l1Bridge = await getL1Bridge()
    const l2Bridge = await getL2Bridge()
    const nvmEth = getNvmEth()
    const l1FraudVerifier = await getL1FraudVerifier();
    const watcher = await initWatcher();

    // Deposit into Nahmii

    const l2BlockNumber = await l2Wallet.provider.getBlockNumber()

    console.log(`L2 balance(${l2Wallet.address}) before deposit: ${(await l2Wallet.getBalance()).toString()}`)

    const depositAmount = ethers.utils.parseEther('0.01')
    const depositTx = await l1Bridge.depositETH(
        DEFAULT_TEST_GAS_L2,
        '0xFFFF',
        {
            value: depositAmount,
            gasLimit: DEFAULT_TEST_GAS_L1
        }
    )
    console.log(`L1 deposit tx hash by wallet ${l1Wallet.address}: ${depositTx.hash}`)
    await waitXDomainTransaction(watcher, depositTx, Direction.L1ToL2, l2BlockNumber)
    console.log(`L2 balance(${l2Wallet.address}) after deposit: ${(await l2Wallet.getBalance()).toString()}`)

    // Transfer in Nahmii

    const otherWallet = ethers.Wallet.createRandom().connect(l2Wallet.provider)
    const transferAmount = ethers.utils.parseEther('0.001')

    const transferTx = await nvmEth.transfer(
        otherWallet.address,
        transferAmount
    )
    console.log(`L2 transfer tx hash by wallet ${l2Wallet.address}: ${transferTx.hash}`)
    await transferTx.wait()
    console.log(`L2 balance(${otherWallet.address}) after transfer: ${(await otherWallet.getBalance()).toString()}`)

    // Withdraw from Nahmii

    const l1BlockNumber = await l1Wallet.provider.getBlockNumber()

    const withdrawAmount = ethers.utils.parseEther('0.005')
    const withdrawTx = await l2Bridge.withdraw(
        nvmEth.address,
        withdrawAmount,
        DEFAULT_TEST_GAS_L2,
        '0xFFFF'
    )
    console.log(`L2 withdraw tx hash by wallet ${l2Wallet.address}: ${withdrawTx.hash}`)
    await withdrawTx.wait()

    const fraudProofWindow = await l1FraudVerifier.FRAUD_PROOF_WINDOW()

    console.log(`Sleeping for the duration of the fraud proof time window, i.e. ${fraudProofWindow.toString()}s`)
    await sleep(fraudProofWindow.toNumber() * 1000)

    await relayXDomainMessage(withdrawTx)
    await waitXDomainTransaction(watcher, withdrawTx, Direction.L2ToL1, l1BlockNumber)

    const l1BalanceAfter = await l1Wallet.getBalance()
    console.log(`L1 balance(${l1Wallet.address}) after withdrawal: ${l1BalanceAfter.toString()}`)
}

run()
