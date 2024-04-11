import fs from 'fs'
import mime from 'mime'
import { DefaultProvider, bsv,  toByteString } from 'scrypt-ts'
import { MachineLearningNft } from '../src/contracts/MachineLearningNft'
import { NeucronSigner } from 'neucron-signer'

export async function Mint(
    nftHolderName:string,
    vectorOfCosine:string,
  
    filename:string
): Promise<string> {
    const fileData: Buffer = await fs.promises.readFile(`./uploads/${filename}`)

    await MachineLearningNft.loadArtifact('./artifacts/MachineLearningNft.json')

    const nec_signer = await new NeucronSigner(
        new DefaultProvider({
            network: bsv.Networks.mainnet,
        })
    )
    await nec_signer.login('ss363757@gmail.com', 'Shubham123')
    
const faceMatchResult="Image just got loaded!"
    const instance = new MachineLearningNft(
        toByteString(nftHolderName,true),
        toByteString(vectorOfCosine,true),
        toByteString(faceMatchResult, true),
    )

    await instance.connect(nec_signer)

    const mimeType: string = mime.lookup(filename) || 'application/octet-stream'
    console.log(`File Type: ${mimeType}`)

    const inscriptiontx = await instance.inscribeImage(fileData, mimeType)
  
 
 
    return inscriptiontx.id
    
}
