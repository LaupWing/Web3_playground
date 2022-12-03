require("@nomicfoundation/hardhat-toolbox")

const MAINNET_RPC_URL =
   process.env.MAINNET_RPC_URL ||
   process.env.ALCHEMY_MAINNET_RPC_URL ||
   "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
const GOERLI_RPC_URL =
   process.env.GOERLI_RPC_URL ||
   "https://eth-goerli.alchemyapi.io/v2/your-api-key"
const POLYGON_MAINNET_RPC_URL =
   process.env.POLYGON_MAINNET_RPC_URL ||
   "https://polygon-mainnet.alchemyapi.io/v2/your-api-key"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x"
// optional
const MNEMONIC = process.env.MNEMONIC || "your mnemonic"

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
   solidity: "0.8.17",
}
