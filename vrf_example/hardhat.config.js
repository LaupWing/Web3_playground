require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0"

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
   solidity: {
      compilers: [
         {
            version: "0.8.17"
         }
      ]
   },
   networks: {
      hardhat: {
         chainId: 31337
      },
      localhost: {
         chainId: 31337
      },
   },
   namedAccounts: {
      deployer: {
         default: 0,
         1: 0 // Main net
      },
      player: {
         default: 1
      }
   }
};
