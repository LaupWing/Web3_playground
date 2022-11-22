require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
   solidity: "0.8.17",
   defaultNetwork: "hardhat",
   networks: {
      hardhat: {
         chainId: 31337,
      },
   },
   namedAccounts: {
      deployer: {
         default: 0,
         1: 0,
      },
   },
}
