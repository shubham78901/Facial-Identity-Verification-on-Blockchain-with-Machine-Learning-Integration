import {
    assert,
    ByteString,
    method,
    prop,
    hash256,
    
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

  

    

    constructor(
       
        nftHolderName: ByteString,
        vectorOfCosine: ByteString,
        faceMatchResult: ByteString,
       
    ) {
        
        super()
        this.init(...arguments)
        this.nftHolderName=nftHolderName
        this.vectorOfCosine=vectorOfCosine
        this.faceMatchResult=faceMatchResult


        
      
    }

    @method()
    public registerResultAfterFaceMatch(
        ownerSig: Sig,
 
        ownerPubKey: PubKey
    ) {
    
        assert(
            this.checkSig(ownerSig, ownerPubKey),
            "User's signature check failed"
        )
     
        let outputs = this.buildStateOutputNFT()
     
        outputs += this.buildChangeOutput()

        this.debug.diffOutputs(outputs)
        assert(
            this.ctx.hashOutputs === hash256(outputs),
            'hashOutputs check failed'
        )
    }

}
