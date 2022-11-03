require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("hardhat-contract-sizer")
require("dotenv").config()

const MAIN_RPC_URL = process.env.MAIN_RPC_URL || process.env.ALCHEMY_MAINNET_RPC_URL || ""
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || ""
const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL || ""
const MNEMONIC = process.env.MNEMONIC || ""

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const POLYGONSCN_API_KEY = process.env.POLYGONSCN_API_KEY || ""
const REPORT_GAS = process.env.REPORT_GAS || false


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
   solidity: "0.8.17",
}
