

import { toByteString } from 'scrypt-ts';
import { MachineLearningNft } from '../src/contracts/MachineLearningNft';

import { getDefaultSigner } from '../tests/utils/txHelper';



export async function Mint(
    nftHolderName: string,
    vectorOfCosine: string,
    hex_string: string,
     fileType:string,
): Promise<string> {
    // Function to generate file data from hex string
    const generateFileDataFromHexString = (hexString: string): Buffer => {
        return Buffer.from(hexString, 'hex');
    };

    const fileData = generateFileDataFromHexString(hex_string);

    // Load contract artifact
    await MachineLearningNft.loadArtifact('./artifacts/MachineLearningNft.json');

    // Create and login with NeucronSigner


    // Create instance of MachineLearningNft contract
    const faceMatchResult = "Image just got loaded!";
    const instance = new MachineLearningNft(
        toByteString(nftHolderName, true),
        toByteString(vectorOfCosine, true),
        toByteString(faceMatchResult, true)
    );

    // Connect to contract instance
    await instance.connect(getDefaultSigner());

    // Get MIME type from filename
    

    // Get MIME type from file data


    // Inscribe image with file data and MIME type
    const inscriptionTx = await instance.inscribeImage(fileData, fileType);

    return inscriptionTx.id;
}
