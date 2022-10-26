import { HardhatUserConfig } from "hardhat/config"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-waffle"
import "@typechain/hardhat"
import "@nomicfoundation/hardhat-toolbox"

const config: HardhatUserConfig = {
   solidity: "0.8.17",
}

export default config