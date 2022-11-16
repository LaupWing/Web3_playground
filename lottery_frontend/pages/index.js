import Head from 'next/head'
import { useMoralis } from "react-moralis"
import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"

const supportedChains = ["31337", "5"]

export default function Home() {
   const { isWeb3Enabled, chainId } = useMoralis()

   return (
      <div>
         <Head>
            <title>Lottery App</title>
            <meta name="description" content="Ethereum lottery app" />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <Header />
         {isWeb3Enabled ? (
            <div>
               {supportedChains.includes(parseInt(chainId).toString()) ? (
                  <div className="flex flex-row">
                     <LotteryEntrance />
                  </div>
               ) : (
                  <div>{`Please switch to a supported chain. The supported chain ids are ${supportedChains}`}</div>
               )}
            </div>
         ) : (
            <div></div>
         )}
      </div>
   )
}
