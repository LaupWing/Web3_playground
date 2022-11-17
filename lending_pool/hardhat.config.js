const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || process.env.ALCHEMY_MAINNET_RPC_URL || ""

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
   solidity: {
      compilers: [
         {
            version: "0.8.17 "
         },
         {
            version: "0.4.19"
         }
      ]
   },
   defaultNetwork: "hardhat",
   networks: {
      hardhat: {
         chainId: 31337,
         forking: {
            url: MAINNET_RPC_URL
         }
      }
   },
   namedAccounts: {
      deployer: {
         default: 0,
         1: 0
      }
   }
};
