const { ethers, getNamedAccounts } = require("hardhat")
const { getWeth } = require("./getWeth")

async function main() {
   await getWeth()
   const { deployer } = await getNamedAccounts()
   const lendingPool = await getLendingPool(deployer)
}

async function getLendingPool(account) {
   const lendingPoolAddressesProvider = await ethers.getContractAt(
      "ILendingPoolAddressesProvider",
      "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
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
