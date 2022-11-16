import React from 'react'
import { useMoralis } from "react-moralis"

const LotteryEntrance = () => {
   const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()


   return (
      <div>LotteryEntrance</div>
   )
}

export default LotteryEntrance