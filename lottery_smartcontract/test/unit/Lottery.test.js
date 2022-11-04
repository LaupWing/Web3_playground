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
            await expect(lottery.enterLottery()).to.be.revertedWithCustomError(lottery, "Lottery__NotEnoughETHEntered")
         })

         it("records player when they enter", async () => {
            await lottery.enterLottery({ value: lotteryEntranceFee })
            const contractPlayer = await lottery.getPlayer(0)
            expect(player.address, contractPlayer)
         })

         it("emit event on enter", async () => {
            await expect(lottery.enterLottery({ value: lotteryEntranceFee })).to.emit(lottery, "LotteryEnter")
         })

         it("doesn't allow entrance when lottery is calculating", async () => {
            await lottery.enterLottery({ value: lotteryEntranceFee })
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.request({ method: "evm_mine", params: [] })
            await lottery.performUpkeep([])
            await expect(lottery.enterLottery({ value: lotteryEntranceFee })).to.be.revertedWithCustomError(lottery, "Lottery__LotteryNotOpen")

         })
      })
      describe("checkUpkeep", function () {
         it("returns false people haven't sent any ETH", async () => {
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.request({ method: "evm_mine", params: [] })
            const { upkeepNeeded } = await lottery.callStatic.checkUpkeep("0x")
            expect(upkeepNeeded).to.equal(false)
         })

         it("returns false if lottery isn't open", async () => {
            await lottery.enterLottery({ value: lotteryEntranceFee })
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.request({ method: "evm_mine", params: [] })
            await lottery.performUpkeep([])
            const lotteryState = await lottery.getLotteryState()
            const { upkeepNeeded } = await lottery.callStatic.checkUpkeep("0x")

            expect(lotteryState.toString()).equal("1")
            expect(upkeepNeeded).equal(false)
         })
      })
   })