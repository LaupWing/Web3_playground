const { getNamedAccounts, ethers } = require("hardhat")


describe("SimpleStorage", function () {

   let deployer
   let simpleStorage
   let simpleStorageFactory
   beforeEach(async () => {
      simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
      deployer = (await getNamedAccounts()).deployer
      await deployments.fixture(["all"])
      simpleStorage = await ethers.getContract("SimpleStorage", deployer)
   })

   it("deployed contract correctly", async () => {
      console.log(simpleStorage)
   })
})