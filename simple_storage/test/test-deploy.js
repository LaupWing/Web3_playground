const { getNamedAccounts, ethers } = require("hardhat")


describe("SimpleStorage", function(){

   let deployer
   let simpleStorage
   beforeEach(async ()=>{
      deployer = await getNamedAccounts()
      simpleStorage = await ethers.getContract("SimpleStorage", deployer)
   })
})