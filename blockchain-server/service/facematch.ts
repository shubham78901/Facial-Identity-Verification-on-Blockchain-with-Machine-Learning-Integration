import {
    DefaultProvider,
    MethodCallOptions,
    PubKey,
    bsv,
   
    findSig,

    toByteString,

    toHex,
} from 'scrypt-ts'
import { MachineLearningNft } from '../src/contracts/MachineLearningNft'

import { getDefaultSigner } from '../tests/utils/txHelper'
import { myAddress,myPublicKey } from '../tests/utils/privateKey'

export async function facematch(
    txid: string,
    outputindex: number,
    currentMessage:string,
    currentFaceMatchcount:number,
): Promise<string> {
    console.log(currentMessage)
    await MachineLearningNft.loadArtifact('./artifacts/MachineLearningNft.json')
    const provider = new DefaultProvider({
        network: bsv.Networks.testnet,
    })
    await provider.connect()
   

    const  tx = await provider.getTransaction(txid)

    const meInstance = MachineLearningNft.fromUTXO({
        txId: tx.id,
        outputIndex: outputindex,
        script: tx.outputs[outputindex].script.toHex(),
        satoshis: tx.outputs[outputindex].satoshis,
    })



   
  
    await meInstance.connect(getDefaultSigner())

    const meLikeInstance = meInstance.next()

    const sc = meLikeInstance.lockingScript 
    
    meLikeInstance.faceMatchResult= toByteString(currentMessage,true)
    meLikeInstance.faceMatchCount=meLikeInstance.faceMatchCount+BigInt(1)
    meInstance.bindTxBuilder('registerResultAfterFaceMatch', async function () {
        const unsignedTx: bsv.Transaction = new bsv.Transaction().addInput(
            meInstance.buildContractInput()
        )
      

        unsignedTx
            .addOutput(
                new bsv.Transaction.Output({
                    script: sc,
                    satoshis: 1,
                })
            )

      
            .change(myAddress)
        return Promise.resolve({
            tx: unsignedTx,
            atInputIndex: 0,
            nexts: [],
        })
    })

   

    try {
      

        const { tx: likeTx } = await meInstance.methods.registerResultAfterFaceMatch(
            (sigResps) => findSig(sigResps, myPublicKey),toByteString(currentMessage,true),
            PubKey(toHex(myPublicKey)),currentFaceMatchcount,
            {
                // sign with the private key corresponding to `myPublicKey` (which is `myPrivateKey` in the signer)
                // since I am the issuer at the beginning
                pubKeyOrAddrToSign: myPublicKey,

                transfer: meLikeInstance,
            } as MethodCallOptions<MachineLearningNft>
        )
        console.log('Recallable of asset token called: ' + likeTx.id)

        return likeTx.id
    } catch (error) {
        console.error('Error while liking:', error)
        return '' // Return early or handle the error as needed
    }
}
