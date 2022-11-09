

module.exports = async ({ getNamedAccounts, deployments }) => {
   const { deployer } = await getNamedAccounts()
   console.log(deployer)
}