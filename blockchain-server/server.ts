import express from 'express'

import mintController from './controller/mintController'
import SendTrainedData from './controller/sendTrainedData'
import faceMatchController from './controller/faceMatchController'
// import shareController from './controller/shareController'
const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json({ limit: '500mb' }))

app.use('/custom', mintController)
app.use('/custom', SendTrainedData)
app.use('/custom', faceMatchController)


app.get('/health', (req, res) => {
    res.json({ status: 'OK' })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
