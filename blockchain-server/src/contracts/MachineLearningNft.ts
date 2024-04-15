import {
    assert,
    ByteString,
    method,
    prop,
  
    
    PubKey,
    Sig,
  
} from 'scrypt-ts'

import { OrdinalNFT } from 'scrypt-ord'

export class MachineLearningNft extends OrdinalNFT {
 

    @prop()
    nftHolderName: ByteString

    @prop()
    vectorOfCosine: ByteString

    @prop(true)
    faceMatchResult: ByteString

    @prop(true)
    faceMatchCount: bigint

  

    

    constructor(
       
        nftHolderName: ByteString,
        vectorOfCosine: ByteString,
        faceMatchResult: ByteString,
        faceMatchCount:bigint,
       
    ) {
        
        super()
        this.init(...arguments)
        this.nftHolderName=nftHolderName
        this.vectorOfCosine=vectorOfCosine
        this.faceMatchResult=faceMatchResult
        this.faceMatchCount=faceMatchCount


        
      
    }

    @method()
    public registerResultAfterFaceMatch(
        ownerSig: Sig,
        faceMatchResult:ByteString,
        ownerPubKey: PubKey
    ) {
    
        assert(
            this.checkSig(ownerSig, ownerPubKey),
            "User's signature check failed"
        )
     this.faceMatchResult=faceMatchResult
     this.faceMatchCount= this.faceMatchCount+BigInt(1)
        let outputs = this.buildStateOutputNFT()
     
        outputs += this.buildChangeOutput()

        this.debug.diffOutputs(outputs)
        assert(
           true,
            'hashOutputs check failed'
        )
    }

}
