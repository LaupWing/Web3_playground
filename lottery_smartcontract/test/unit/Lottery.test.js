const { expect } = require("chai");
const { network, ethers, deployments } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");


!developmentChains.includes(network.name)
   ? describe.skip
   : describe("Lottery Unit Tests", function () {
      let lottery, lotteryContract, vrfCoordinatorV2Mock, lotteryEntranceFee, interval, player

      beforeEach(async () => {
         accounts = await ethers.getSigners()
         player = accounts[1]
         await deployments.fixture(["mocks", "lottery"])
         vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
         lotteryContract = await ethers.getContract("Lottery")
         lottery = lotteryContract.connect(player)
         lotteryEntranceFee = await lottery.getEntranceFee()
         interval = await lottery.getInterval()
      })

      describe("constructor", function () {
         it("initializes the lottery correctly", async () => {
            const lotteryState = (await lottery.getLotteryState()).toString()
            expect(lotteryState).to.equal("0")
            expect(interval.toString(), networkConfig[network.config.chainId]["keepersUpdateInterval"])
         })
      })

      describe("enterLottery", function () {
         it("reverts when you don't pay enough", async () => {
            await lottery.enterLottery({ value: lotteryEntranceFee })

         })
      })
   })