require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")

// const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const GOERLI_RPC_URL =
   process.env.GOERLI_RPC_URL ||
   "https://eth-goerli.alchemyapi.io/v2/your-api-key"
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
   solidity: {
      compilers:[
         {
            version: "0.8.17" 
         },
         {
            version: "0.6.6" 
         }
      ]
   },
   defaultNetwork: "hardhat",
   networks:{
      hardhat: {
         chainId: 31337
      },
      goerli: {
         url: GOERLI_RPC_URL,
         accounts: [PRIVATE_KEY],
         chainId: 5,
         blockConfirmations: 6,
     },
   },
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
