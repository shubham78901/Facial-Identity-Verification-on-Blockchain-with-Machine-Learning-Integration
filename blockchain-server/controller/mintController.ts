import express from 'express'
import multer from 'multer'
import { Mint } from '../service/deploy'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post('/mint', upload.single('file'), async function (req, res) {
    console.log('Handling mint request...')

    const {
        nftHolderName,
        vectorOfCosine,
        hex_string,
        fileType,
    } = req.body

  

    
// console.log(req.body)
    try {
        console.log(
            'Received minting request with TokenSupply:',
            nftHolderName,
            vectorOfCosine,
        
            // hex_string
           
        )
        

        console.log('Loan token minting request')
        const mintResult = await Mint(
            nftHolderName,
            vectorOfCosine,
         
            hex_string,
            fileType
         
        )

        console.log(`Publish successful. Token ID: ${mintResult}`)


        res.json({
            success: true,
            mintResult: { mintResult},
        })
    } catch (error) {
        console.error('Error publishing article:', error)
        res.status(500).json({ success: false, error: 'Internal Server Error' })
    }
})

export default router