from fastapi import FastAPI, File, UploadFile,Request,HTTPException
from fastapi.responses import FileResponse
import cv2
import numpy as np
import torch
import torchvision.transforms as transforms
from torchvision.models import mobilenet_v2
import chromadb
import uvicorn
import uuid


from fastapi.responses import JSONResponse  # Import JSONResponse

import aiohttp 
app = FastAPI()
db = chromadb.PersistentClient(path="dbFile")
try:
    collection = db.create_collection(name="faceRecognition",metadata={"hnsw:space": "cosine"})
except:
    collection=db.get_collection(name="faceRecognition")

# Load MobileNetV2 model
model = mobilenet_v2(pretrained=True)
model.eval()

@app.get("/")
async def root():
    return FileResponse("static/index.html")

@app.get("/recognise")
async def root():
    return FileResponse("static/recognise.html")

@app.get("/upload")
async def root():
    return FileResponse("static/upload.html")

@app.post("/storeImage")
async def store_image(request: Request, file: UploadFile = File(...)):
    # Read the uploaded image
    form_data = await request.form()
    name = form_data.get("name")

    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    _, buffer = cv2.imencode('.jpg', image)
    byte_array = buffer.tobytes()

    # Convert the byte array to a hex string
    hex_string = byte_array.hex()

    # Preprocess the image
    transformed_image = preprocess_image(image)

    # Encode the image using MobileNetV2
    image_vector = encode_image(transformed_image)

    # Generate a new UUID
    new_id = str(uuid.uuid4())
    nftHolderName = name
    vectorOfCosine = name

    # Get the transaction ID after minting NFT
    txid = await getTxidAfterMintingNft(nftHolderName, vectorOfCosine, file)
    
    print("txid in main",txid)

    # Ensure txid is not None
    if txid is None:
        txid = ""

    # Add the image data to the Chroma DB collection
    collection.add(
        documents=[hex_string],
        embeddings=[image_vector.tolist()],
        metadatas=[{"name": name, "txid": str(txid), "currenttxid": str(txid) }],  # Ensure txid is not None
        ids=[new_id]
    )

    # Return the response with relevant data
    print(JSONResponse(content={"result": "Success!", "txid": str(txid)}))
    return JSONResponse(content={"result": "Success!", "txid": str(txid)})

@app.post("/getName")
async def get_name(file: UploadFile = File(...)):
    try:
        # Read the uploaded image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Preprocess the image
        transformed_image = preprocess_image(image)

        # Encode the image using MobileNetV2
        image_vector = encode_image(transformed_image)

        # Search for the closest match in Chroma DB and return the name
        result = collection.query(
            query_embeddings=[image_vector.tolist()],
            n_results=1
        )

        res = {
            "name": "Not Found",
            "hexImage": "null",
            "id": "null"
        }
        print(result['distances'][0][0])
        if result['distances'][0][0] <= 0.2:
            res["name"] = result['metadatas'][0][0]['name']
            res["hexImage"] = result['documents'][0][0]
            res["id"] = result['ids'][0][0]

        return res
    except Exception as e:
        # Log the error for debugging
        print(f"Error processing image: {e}")
        # Raise a more detailed HTTPException
        raise HTTPException(status_code=422, detail="Error processing image")
    
def preprocess_image(image):
    transform = transforms.Compose([
        transforms.ToPILImage(),
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    return transform(image).unsqueeze(0)

def encode_image(transformed_image):
    with torch.no_grad():
        features = model(transformed_image)
    return features.squeeze().numpy()

async def getTxidAfterMintingNft(nftHolderName, vectorOfCosine, image):
    print("inside api calling")
    try:
        async with aiohttp.ClientSession() as session:
            form_data = aiohttp.FormData()
            form_data.add_field('nftHolderName', nftHolderName)
            form_data.add_field('vectorOfCosine', vectorOfCosine)
            form_data.add_field('file', image.file, filename=image.filename, content_type='image/jpeg')

            async with session.post('http://13.202.14.28:5000/custom/mint', data=form_data) as response:
                if response.status == 200:
                    data = await response.json()
                    mint_result = data.get('mintResult', None)
                    if isinstance(mint_result, dict):
                        mint_result = mint_result.get('mintResult')
                    print("in calling func a data", data)
                    print("in calling func", mint_result)
                    return mint_result
                else:
                    print("Error in minting NFT:", await response.text())
                    return None
    except Exception as e:
        print(f"Error in minting NFT: {e}")
        return None


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
