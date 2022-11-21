const { ethers, getNamedAccounts } = require("hardhat")
const { getWeth, AMOUNT } = require("./getWeth")

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

async function approveErc20(spenderAddress, amount, signer) {
   const erc20Token = await ethers.getContractAt(
      "IERC20",
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      signer
   )
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

async function main() {
   await getWeth()
   const { deployer } = await getNamedAccounts()
   const lendingPool = await getLendingPool(deployer)

   await approveErc20(lendingPool.address, AMOUNT, deployer)
   console.log("Depositing")

   let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(
      lendingPool,
      deployer
   )
}

main()
   .then(() => process.exit(0))
   .catch((err) => {
      console.error(err)
      process.exit(1)
   })
