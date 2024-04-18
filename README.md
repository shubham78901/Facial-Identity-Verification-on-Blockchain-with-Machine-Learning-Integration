Facial Identity Verification on Blockchain
deployed link=  https://9560-13-202-14-28.ngrok-free.app/
Unique Selling Proposition (USP):

Unprecedented Transparency: Inscribing unique faces onto personalized tokens and recording them on the blockchain ensures complete transparency in identity verification processes.
Fraud Detection Reinvented: By tracking the chain of transactions associated with each face image, our system enhances fraud detection capabilities, minimizing the risk of identity theft and misuse.
Improved Recognition Model Efficiency: Solving ambiguities in recognition models, our platform optimizes the efficiency of facial recognition systems, delivering accurate and reliable results.

Installation and Setup Guide
Server Setup
There are two servers required to run this project:

1.Machine Learning Server
Contains all Python and frontend files.
Tech stack used: Python, HTML, CSS, ChromaDB, Machine Learning models.
Running on port 8000.
Provides two APIs:
/upload: Allows users to upload a face image with a name.
/getname: Unlocks if the current person's face is near to any locked image.
Steps to Install:

cd ml-server
pip install -r requirements.txt


2.Blockchain Server
Contains all APIs of functions of smart contracts.
Contract used: Stateful, Satordinal.
Running on port 5000.
Provides two APIs:
/mint: Uploads image vector and other information of image NFT to the chain.
/facematch: Gets triggered when /getname API of ML server is called, increases face match count on blockchain with necessary assertion.
Steps to Run:

cd blockchain-server
npm i
npx-ts-node server.ts
