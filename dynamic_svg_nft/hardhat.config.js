require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const GOERLI_RPC_URL =
   process.env.GOERLI_RPC_URL ||
   "https://eth-goerli.alchemyapi.io/v2/your-api-key"
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
   solidity: "0.8.17",
   defaultNetwork: "hardhat",
   namedAccounts:{
      deployer: {
         default: 0,
         1: 0
      }
   },
   moch:{
      timeout: 200000
   }
}
