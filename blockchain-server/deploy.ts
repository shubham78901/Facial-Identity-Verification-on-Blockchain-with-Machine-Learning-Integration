import {
    PubKey,
    toHex,
    toByteString,
    DefaultProvider,
    bsv,
    findSig,
    MethodCallOptions,
    buildPublicKeyHashScript,
    hash160,
} from 'scrypt-ts'
import { Article } from './src/contracts/Article'
import { getDefaultSigner, sleep } from './tests/utils/txHelper'
import { myPublicKey, myAddress } from './tests/utils/privateKey'

async function main() {
    // const commentMap = new HashedMap<bigint, ByteString>()
    await Article.loadArtifact('./artifacts/Article.json')

    const text = 'hello xiahoui'

    const instance = new Article(
        5n,
        5n,
        toByteString('shubham', true),
        toByteString('shubham', true),
        toByteString('shubham', true),
        toByteString('shubham', true),
        toByteString('shubham', true),
        toByteString('shubham', true),
        PubKey(toHex(myPublicKey)),
        0n,
        0n
    )

    await instance.connect(getDefaultSigner())

    const inscriptiontx = await instance.inscribeText(text)
    // console.log(inscriptiontx.toString())

    // console.log('inscriptiontx id', inscriptiontx.)

    const provider = new DefaultProvider({
        network: bsv.Networks.testnet,
    })

    await provider.connect()

    const txl: bsv.Transaction = inscriptiontx
    const txstring=txl.toString()
    const tx=new bsv.Transaction(
        txstring
        )

    const meInstance = Article.fromUTXO({
        txId: tx.id,
        outputIndex: 0,
        script: tx.outputs[0].script.toHex(),
        satoshis: 1,
    })
    await meInstance.connect(getDefaultSigner())
    const meLikeInstance = meInstance.next()
    meLikeInstance.likecount = meLikeInstance.likecount + BigInt(1)
    const sc = meLikeInstance.lockingScript

    meInstance.bindTxBuilder('like', async function () {
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

            .addOutput(
                new bsv.Transaction.Output({
                    script: buildPublicKeyHashScript(
                        hash160(myPublicKey.toString())
                    ),
                    satoshis: 10,
                })
            )

            .change(myAddress)
        return Promise.resolve({
            tx: unsignedTx,
            atInputIndex: 0,
            nexts: [],
        })
    })

    const { tx: likeTx } = await meInstance.methods.like(
        (sigResps) => findSig(sigResps, myPublicKey),
        PubKey(toHex(myPublicKey)),
        10n,
        meInstance.authorPubKey,
        {
            // sign with the private key corresponding to `myPublicKey` (which is `myPrivateKey` in the signer)
            // since I am the issuer at the beginning
            pubKeyOrAddrToSign: myPublicKey,

            transfer: meLikeInstance,
        } as MethodCallOptions<Article>
    )
    console.log('Recallable of asset token called: ' + likeTx.id)

    sleep(3)

    // const tx2 = await provider.getTransaction(likeTx.id)

    // const meInstance1 = Article.fromUTXO({
    //     txId: likeTx.id,
    //     outputIndex: 0,
    //     script: tx2.outputs[0].script.toHex(),
    //     satoshis: 1,
    // })

    // const latestInstance = meInstance1

    // const likecount = latestInstance.likecount
    // const sharecount = latestInstance.sharecount
    // console.log('likecount:', likecount)
    // console.log('sharecount', sharecount)
}

// async function like() {

//     await Article.loadArtifact('./artifacts/Article.json')

// }

main().catch(console.error)

//  transfer: {
//     instance: nextInstance,
//     amt: transferAmount,
// // },
