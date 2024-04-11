import {
    DefaultProvider,
    MethodCallOptions,
    PubKey,
    bsv,
   
    findSig,

    toHex,
} from 'scrypt-ts'
import { MachineLearningNft } from '../src/contracts/MachineLearningNft'

import { NeucronSigner } from 'neucron-signer'

export async function facematch(
    txid: string,
    outputindex: number
): Promise<string> {
    await MachineLearningNft.loadArtifact('./artifacts/MachineLearningNft.json')
    const provider = new DefaultProvider({
        network: bsv.Networks.mainnet,
    })
    await provider.connect()
    const nec_signer = await new NeucronSigner(
        new DefaultProvider({
            network: bsv.Networks.mainnet,
        })
    )
    await nec_signer.login('ss363757@gmail.com', 'Shubham123')
    await nec_signer.connect(provider)
    let tx: bsv.Transaction = await provider.getTransaction(txid)

    const meInstance = MachineLearningNft.fromUTXO({
        txId: tx.id,
        outputIndex: outputindex,
        script: tx.outputs[outputindex].script.toHex(),
        satoshis: tx.outputs[outputindex].satoshis,
    })

    await meInstance.connect(nec_signer)
    const latestInstance=meInstance
  
    await latestInstance.connect(nec_signer)

    const meLikeInstance = latestInstance.next()

    const sc = meLikeInstance.lockingScript 
    const myAddress = await nec_signer.getDefaultAddress()
    latestInstance.bindTxBuilder('registerResultAfterFaceMatch', async function () {
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

    const myPublicKey = await nec_signer.getDefaultPubKey()

    try {
      

        const { tx: likeTx } = await latestInstance.methods.registerResultAfterFaceMatch(
            (sigResps) => findSig(sigResps, myPublicKey),
            PubKey(toHex(myPublicKey)),
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
