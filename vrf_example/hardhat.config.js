require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")

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
