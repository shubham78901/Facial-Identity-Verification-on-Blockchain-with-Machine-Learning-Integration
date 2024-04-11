import express, { Request, Response } from 'express';
import { SendTrainedData } from '../service/traindata'; // Import the SendTrainedData function from its module

const router = express.Router();


router.post('/traineddata', async function (req: Request, res: Response) {
    console.log('Handling send-trained-data request...');

    const { txid, outputindex } = req.body;

    try {
        console.log('Received request for trained data:', txid, outputindex);

        console.log('Sending trained data request...');

        // Call the SendTrainedData function
        const result = await SendTrainedData(txid, outputindex);

        console.log(`Data sent successfully`);

        res.json({ success: true, result });
    } catch (error) {
        console.error('Error sending trained data:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

export default router;
