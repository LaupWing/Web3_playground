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

main()
   .then(() => process.exit(0))
   .catch((err) => {
      console.error(err)
      process.exit(1)
   })
