import express from 'express'
import multer from 'multer'
import { Mint } from '../service/deploy'
import fs from 'fs'
import path from 'path'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

function getRandomFileFromUploads() {
    const uploadDirectory = './uploads'
    const files = fs.readdirSync(uploadDirectory)
    if (files.length === 0) {
        throw new Error('No files found in the uploads directory')
    }
    const randomIndex = Math.floor(Math.random() * files.length)
    return path.join(uploadDirectory, files[randomIndex])
}

router.post('/mint', upload.single('file'), async function (req, res) {
    console.log('Handling mint request...')

    const {
        nftHolderName,
        vectorOfCosine,
      
    } = req.body

    let file

    if (req.file) {
        file = req.file // Use the uploaded file
    } else {
        try {
            file = getRandomFileFromUploads() // Pick any file from the uploads directory
        } catch (error) {
            console.error('Error getting random file:', error)
            return res
                .status(500)
                .json({ success: false, error: 'Internal Server Error' })
        }
    }

    try {
        console.log(
            'Received minting request with TokenSupply:',
            nftHolderName,
            vectorOfCosine,
        
            file.filename
           
        )

        console.log('Loan token minting request')
        const mintResult = await Mint(
            nftHolderName,
            vectorOfCosine,
         
            file.filename
         
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