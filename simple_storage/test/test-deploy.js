const { getNamedAccounts, ethers } = require("hardhat")
const { expect } = require("chai")

describe("SimpleStorage", function () {

   let deployer
   let simpleStorage
   let simpleStorageFactory

   const startingValue = "69"

   beforeEach(async () => {
      simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
      deployer = (await getNamedAccounts()).deployer
      await deployments.fixture(["all"])
      simpleStorage = await ethers.getContract("SimpleStorage", deployer)
   })

   // it("deployed contract correctly", async () => {
   //    console.log(simpleStorage)
   // })
   it("Should start with a favorite number of 69", async () => {
      const currentValue = await simpleStorage.retrieve()
      expect(currentValue.toString()).to.equal(startingValue)
   })
   
   it("Should update favorite number", async () => {
      const updatedValue = "70"
      await simpleStorage.addAnotherFavoriteNumber(updatedValue)
      const currentValue = await simpleStorage.retrieve()
      expect(currentValue.toString()).to.equal(updatedValue)
   })

   it("Should add people to struct and array", async()=>{
      const [_, user1] = await ethers.getSigners()
      const connectedContract1 = await simpleStorage.connect(user1)
      await connectedContract1.addAnotherFavoriteNumber("70")
      const stored = await simpleStorage.people(0)
      expect(stored.user).to.equal(user1.address)
   })
})