import express, { Request, Response } from 'express'
import { facematch } from '../service/facematch' // Import the like function from its module

const router = express.Router()

router.post('/facematch', async function (req: Request, res: Response) {
    console.log('Handling like request...')

    const { txid, outputindex,currentMessage } = req.body
    console.log(currentMessage)

    try {
        console.log('Received request for data:', txid, outputindex)

        console.log('Data request')

        // Call the like function
        const result = await facematch(txid, outputindex,currentMessage)

        console.log(`Like successful. Transaction ID: ${result}`)

        res.json({ success: true, result })
    } catch (error) {
        console.error('Error liking article:', error)
        res.status(500).json({ success: false, error: 'Internal Server Error' })
    }
})

export default router
