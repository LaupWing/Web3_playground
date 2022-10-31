import { ethers } from "./ethers-5.2.esm.min.js"


(document.getElementById("connectButton")).addEventListener("click", connect)
const withdrawButton = document.getElementById("withdrawButton")
const fundButton = document.getElementById("fundButton")
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
   
   if(typeof window.ethereum !== "undefined"){
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
   }
}