import {useState} from 'react'
import suietLogo from './assets/suiet-logo.svg'
import './App.css'
import {ConnectButton, useAccountBalance, useWallet} from "@suiet/wallet-kit";
import '@suiet/wallet-kit/style.css';
import * as tweetnacl from 'tweetnacl'


function App() {
  const {
    wallet,
    connected,
    connecting,
    account,
    signAndExecuteTransaction,
    // executeMoveCall,
    signMessage,
    getPublicKey,
    configuredWallets,
    detectedWallets,
    allAvailableWallets,
  } = useWallet();
  const {balance} = useAccountBalance();

  function uint8arrayToHex(value: Uint8Array | undefined) {
    if (!value) return ''
    // @ts-ignore
    return value.toString('hex')
  }

  async function handleExecuteMoveCall() {
    try {
      const data = {
        packageObjectId: '0x2',
        module: 'devnet_nft',
        function: 'mint',
        typeArguments: [],
        arguments: [
          'Skull Sui',
          'Skulls are emerging from the ground!',
          'https://gateway.pinata.cloud/ipfs/QmcsJtucGrzkup9cZp2N8vvTc9zxuQtV85z3g2Rs4YRLGX',
        ],
        gasBudget: 100000,
      };
      const resData = await signAndExecuteTransaction({
        transaction: {
          kind: 'moveCall',
          data
        }
      });
      // const resData = await executeMoveCall(data);
      console.log('executeMoveCall success', resData);
      alert('Congrats!! You minted First Skull Test NFT');
    } catch (e) {
      console.error('executeMoveCall failed', e);
      alert('executeMoveCall failed (see response in the console)');
    }
  }

  async function handleSignMsg() {
    try {
      const msg = 'Hello world!'
      const result = await signMessage({
        message: new TextEncoder().encode('Hello world')
      })
      if (!result) {
        alert('signMessage return null')
        return
      }
      console.log('send message to be signed', msg)
      const textDecoder = new TextDecoder()
      console.log('signMessage success', result)
      console.log('signMessage signature', result.signature)
      console.log('signMessage signedMessage', textDecoder.decode(result.signedMessage).toString())
      console.log('verify via tweetnacl', tweetnacl.sign.detached.verify(
        result.signedMessage,
        result.signature,
        account?.publicKey as Uint8Array,
      ))
      alert('signMessage succeeded (see response in the console)')
    } catch (e) {
      console.error('signMessage failed', e)
      alert('signMessage failed (see response in the console)')
    }
  }

  async function handleGetPublicKey() {
    try {
      const publicKey = await getPublicKey()
      alert('getPublicKey succeed (see console for details)')
      console.log('[Deprecated] getPublicKey succeed', publicKey)
    } catch (e) {
      console.error('[Deprecated] getPublicKey failed', e)
      throw e
    }
  }

  return (
    <div className="App">
      <div>
        <a href="https://twitter.com/Skullsui" target="_blank">
          <img src="/bannnn.png" className="logo" alt="Skull"/>
        </a>
      </div>
      <h1>Skull Sui </h1>
      <div className="card">
        <ConnectButton/>

        {!connected ? (
          <p>Mint your exclusive skull on Devnet!</p>
        ) : (
          <div>
     
            <div className={'btn-group'} style={{margin: '8px 0'}}>
              <button onClick={handleExecuteMoveCall}>Mint Skull</button>
            </div>
          </div>
        )}
      </div>
      <p className="read-the-docs">
      SkullSui 2022- ALL Rights Reserved
      </p>
    </div>
  )
}

export default App
