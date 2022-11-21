const { ethers, getNamedAccounts } = require("hardhat")
const { getWeth, AMOUNT } = require("./getWeth")

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F"

async function getLendingPool(account) {
   const lendingPoolAddressesProvider = await ethers.getContractAt(
      "ILendingPoolAddressesProvider",
      "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
      account
   )
   const lendingPoolAddress =
      await lendingPoolAddressesProvider.getLendingPool()
   const lendingPool = await ethers.getContractAt(
      "ILendingPool",
      lendingPoolAddress,
      account
   )
   return lendingPool
}

async function getDaiPrice() {
   const daiEthPriceFeed = await ethers.getContractAt(
      "AggregatorV3Interface",
      "0x773616e4d11a78f511299002da57a0a94577f1f4"
   )
   const price = (await daiEthPriceFeed.latestRoundData())[1]
   console.log(`The DAI/ETH price is ${price.toString()}`)
   return price
}

async function approveErc20(erc20Address, spenderAddress, amount, signer) {
   const erc20Token = await ethers.getContractAt("IERC20", erc20Address, signer)
   transaction_response = await erc20Token.approve(spenderAddress, amount)
   await transaction_response.wait(1)
   console.log("Approved")
}

async function getBorrowUserData(lendingPool, account) {
   const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
      await lendingPool.getUserAccountData(account)

   console.log(`You have ${totalCollateralETH} worth of ETH deposited`)
   console.log(`You have ${totalDebtETH} worth of ETH borrowed`)
   console.log(`You can borrow ${availableBorrowsETH} worth of ETH`)
   return {
      totalDebtETH,
      availableBorrowsETH,
   }
}

async function borrowDai(lendingPool, amountDaiToBorrow, account) {
   const borrow_transaction = await lendingPool.borrow(
      DAI_ADDRESS,
      amountDaiToBorrow,
      1,
      0,
      account
   )
   await borrow_transaction.wait(1)
   console.log("You've borrowed!")
}

async function repay(amount, lendingPool, account) {
   await approveErc20(DAI_ADDRESS, lendingPool.address, amount, account)
   const repay_transaction = await lendingPool.repay(
      DAI_ADDRESS,
      amount,
      1,
      account
   )
   await repay_transaction.wait(1)
   console.log("Repaid!")
}

async function main() {
   await getWeth()
   const { deployer } = await getNamedAccounts()
   const lendingPool = await getLendingPool(deployer)

   await approveErc20(WETH_ADDRESS, lendingPool.address, AMOUNT, deployer)
   console.log("Depositing WETH...")
   await lendingPool.deposit(
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      AMOUNT,
      deployer,
      0
   )
   console.log("Deposited!")

   let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(
      lendingPool,
      deployer
   )
   const daiPrice = await getDaiPrice()
   console.log(availableBorrowsETH.toString() * 0.95)
   const amountDaiToBorrow =
      availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber())
   const amountDaiToBorrowWei = ethers.utils.parseEther(
      amountDaiToBorrow.toString()
   )
   console.log(`You can borrow ${amountDaiToBorrow.toString()} DAI`)
   await borrowDai(lendingPool, amountDaiToBorrowWei, deployer)
   await getBorrowUserData(lendingPool, deployer)
   await repay(amountDaiToBorrowWei, lendingPool, deployer)
   await getBorrowUserData(lendingPool, deployer)
}

main()
   .then(() => process.exit(0))
   .catch((err) => {
      console.error(err)
      process.exit(1)
   })
