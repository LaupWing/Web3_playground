require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

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
      goerli: {
         url: GOERLI_RPC_URL,
         accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : []
      }
   },
   etherscan: {
      apiKey: {
         goerli: ETHERSCAN_API_KEY
      }
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
