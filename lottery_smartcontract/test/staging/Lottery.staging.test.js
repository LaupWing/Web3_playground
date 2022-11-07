const { network, getNamedAccounts, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");


developmentChains.includes(network.name)
   ? describe.skip
   : describe("Lottery Staging Tests", function () {
      let lottery, lotteryEntranceFee, deployer

      beforeEach(async () => {
         deployer = (await getNamedAccounts()).deployer
         lottery = await ethers.getContract("Lottery", deployer)
         lotteryEntranceFee = await lottery.getEntranceFee()
      })

      describe("End to End test", function () {
         console.log(lottery)
      })
   })