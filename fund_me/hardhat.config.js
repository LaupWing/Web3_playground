require("@nomicfoundation/hardhat-toolbox")

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const GOERI_RPC_URL = process.env.GOERI_RPC_URL || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
   defaultNetwork: "hardhat",
   networks:{
      hardhat:{
         chainId: 31337
      },
      goerli:{
         url: GOERI_RPC_URL,
         accounts: [PRIVATE_KEY],
         chainId: 5,
         blockConfirmations: 6
      }
   },
   solidity: [
      {
         version:"0.8.17"
      },
      {
         version: "0.6.6"
      }
   ],
   etherscan:{
      apiKey: ETHERSCAN_API_KEY
   },
   gasReporter:{
      enabled: true,
      currency: "USD",
      outputFile: "gas-reporter.txt",
      noColors: true,
      coinmarketcap: COINMARKETCAP_API_KEY
   },
   namedAccount:{
      deployer:{
         default: 0,
         1: 0 // Defaults to 0 whenever on the chainId of 1
      }
   }
};
