
const DECIMALS = "8"
const INITIAL_PRICE = "200000000000"

/** @type import('hardhat/config'). */
module.exports = async ({ getNamedAccounts, deployments }) => {
   const { log, deploy } = deployments
   const { deployer } = await getNamedAccounts()
   const test = await getNamedAccounts()

   console.log(deployer)
   console.log(test)
   console.log(deploy)
}