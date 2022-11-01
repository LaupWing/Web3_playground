import { abi, contractAddress } from "./constants.js"
import { ethers } from "./ethers-5.2.esm.min.js"


document.getElementById("connectButton").addEventListener("click", connect)
document.getElementById("fundButton").addEventListener("click", fund)
const withdrawButton = document.getElementById("withdrawButton")
const balanceButton = document.getElementById("balanceButton")



async function connect() {
   if (typeof window.ethereum !== "undefined") {
      try {
         await ethereum.request({ method: "eth_requestAccounts" })
      } catch (e) {
         console.log(e)
      }
      connectButton.innerHTML = "Connected"
      const accounts = await ethereum.request({ method: "eth_accounts" })
      console.log(accounts)
   }
}

async function fund(){
   const ethAmount = document.getElementById("ethAmount").value
   console.log(ethAmount)
   // if(typeof window.ethereum !== "undefined"){
   //    const provider = new ethers.providers.Web3Provider(window.ethereum)
   //    const signer = provider.getSigner()
   //    const contract = new ethers.Contract(contractAddress, abi, signer)
   //    try{
   //       const transactionResponse = await contract.fund({
   //          value: ethers.utils.parseEther(ethAmount)
   //       })

   //    }catch(e){
   //       console.error(e)
   //    }
   // }
}