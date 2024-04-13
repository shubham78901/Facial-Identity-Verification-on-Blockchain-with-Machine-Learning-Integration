#!/bin/bash

# Install PyTorch
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Run the FastAPI application
uvicorn main:app --host 0.0.0.0 --port 10000
