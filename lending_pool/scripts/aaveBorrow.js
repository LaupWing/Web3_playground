const { ethers } = require("hardhat")
const { getWeth } = require("./getWeth")

async function main() {
   await getWeth()
   // const lendingPool = await
}

async function getLendingPool(account) {
   const lendingPoolAddressesProvider = await ethers.getContractAt(
      "ILendingPoolAddressesProvider",
      "0x24a42fD28C976A61Df5D00D0599C34c4f90748c8",
      account
   )
   const lendingPoolAddress =
      await lendingPoolAddressesProvider.getLendingPool()
   const lendingPool = await ethers.getContract(
      "ILendingPool",
      lendingPoolAddress,
      account
   )
   return lendingPool
}

main()
   .then(() => process.exit(0))
   .catch((err) => {
      console.error(err)
      process.exit(1)
   })
