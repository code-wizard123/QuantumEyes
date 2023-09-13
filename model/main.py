import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import torch
import torch.nn as nn
from torch.autograd import Function
from torchvision import transforms

import io
from PIL import Image, ImageOps
from flask import Flask, request, jsonify
import numpy as np

import qiskit
from qiskit.visualization import *

from keras.models import load_model 
import flask_cors as cors

from classes import Hybrid , ConvNet , HybridFunction , QuantumCircuit
import __main__

setattr(__main__, "ConvNet", ConvNet)
setattr(__main__, "Hybrid", Hybrid)
setattr(__main__, "HybridFunction", HybridFunction)
setattr(__main__, "QuantumCircuit", QuantumCircuit)

device = torch.device("cpu")

QC_outputs = ['000', '001', '010', '011', '100', '101', '110', '111']

model = ConvNet()
model = torch.load('model95perc.pt', map_location = 'cpu')
verify_model = load_model('keras_model.h5', compile=False)

def transform_image(image):
    preprocess = transforms.Compose([
        transforms.Resize(224),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
    ])

    input_tensor = preprocess(image)
    input_image = input_tensor[:3, :, :]
    input_image.resize(1, 3, 224, 224)
    return input_image


def predict(input):
    model.eval()
    prediction, theta = model(input.to(device))

    _, predicted = torch.max(prediction.data, 1)
    return predicted.item()

def verifyinput(input):
    output = verify_model.predict(input)[0]
    if output[0] > 0.5:
        return 0
    else:
        return 1
    

app = Flask(__name__)
cors.CORS(app)


@app.route('/predict', methods=['POST'])
def index():
    if request.method == "POST":
        file = request.files['file']
        if file is None or file.filename == "":
            return jsonify({'error': 'No file Uploaded'})

        try:
            image_bytes = file.read()
            pillow_image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            return jsonify({'class_id': predict(transform_image(pillow_image))})

        except Exception as e:
            return jsonify({'error': str(e)})


@app.route('/verify', methods=['POST'])
def verify():
    if request.method == "POST":
        file = request.files['file']
        if file is None or file.filename == "":
            return jsonify({'error': 'No file Uploaded'})

        try:
            image_bytes = file.read()
            pillow_image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
            size = (224, 224)
            convimage = ImageOps.fit(pillow_image, size, Image.Resampling.LANCZOS)

            image_array = np.asarray(convimage)

            normalized_image_array = (image_array.astype(np.float32) / 127.5) - 1

            data[0] = normalized_image_array

            return jsonify({'class_id': verifyinput(data)})

        except Exception as e:
            return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=False)
