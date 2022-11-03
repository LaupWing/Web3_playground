require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("hardhat-contract-sizer")
require("dotenv").config()

const MAIN_RPC_URL = process.env.MAIN_RPC_URL || process.env.ALCHEMY_MAINNET_RPC_URL || ""
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || ""
const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0"
const MNEMONIC = process.env.MNEMONIC || ""

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const POLYGONSCN_API_KEY = process.env.POLYGONSCN_API_KEY || ""
const REPORT_GAS = process.env.REPORT_GAS || false


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
   solidity: "0.8.17",
   networks:{
      hardhat:{
         chainId: 31337
      },
      localhost:{
         chainId: 31337
      },
      goerli:{
         url: GOERLI_RPC_URL,
         accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
         // accounts:{
         //    mnemonic: MNEMONIC
         // },
         savedDeployments: true,
         chainId: 5
      },
      mainnet:{
         url: MAIN_RPC_URL,
         accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
         // accounts:{
         //    mnemonic: MNEMONIC
         // },
         savedDeployments: true,
         chainId: 1
      },
      polyogon:{
         url: POLYGON_MAINNET_RPC_URL,
         accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
         savedDeployments: true,
         chainId: 137
      },
      localhost:{
         chainId: 31337
      },
   },
   etherscan:{
      apiKey:{
         goerli: ETHERSCAN_API_KEY,
         polyogon: POLYGONSCN_API_KEY
      }
   },
   gasReporter:{
      enabled: REPORT_GAS,
      currency: "USD",
      outputFile: "gas-report.txt",
      noColors: true,
      // coinmarketcap: process.env.COINMARKETCAP_API_KEY
   },
   contractSizer:{
      runOnCompile: false,
      only: ["Lottery"]
   },
   namedAccounts:{
      deployer:{
         default: 0,
         1: 0
      },
      player:{
         default: 1
      }
   },
   solidity:{
      compilers:[
         {
            version: "0.8.7"
         },
         {
            version: "0.4.24"
         },
      ]
   },
   mocha:{
      timeout: 500000
   }
}
