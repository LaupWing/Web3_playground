import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useMoralis } from "react-moralis"

const supportedChains = ["31337", "5"]

export default function Home() {
   const { isWeb3Enabled, chainId } = useMoralis()

   return (
      <div className={styles.container}>
         <Head>
            <title>Lottery App</title>
            <meta name="description" content="Ethereum lottery app" />
            <link rel="icon" href="/favicon.ico" />
         </Head>

      </div>
   )
}
