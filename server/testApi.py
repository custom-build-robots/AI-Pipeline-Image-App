# -*- coding: utf-8 -*-
"""
Created on Wed Sep 29 16:15:04 2021

@author: Q493358
"""

import requests
from flask import Flask
from flask_sqlalchemy import SQLAlchemy 
from flask import jsonify, request
from flask_restful import  Api
from flask_cors import CORS, cross_origin
import base64
import json


def buil_app():
    app = Flask(__name__)

    # Database credentials
    URL = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(
        user='tae20admin@tae20postgres',
        pw='TAE20DArules!',
        url='tae20postgres.postgres.database.azure.com',
        db='TA_Analytics')

    app.config['SQLALCHEMY_DATABASE_URI'] = URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['PROPAGATE_EXCEPTIONS'] = False
    app.debug = True
    # cors = CORS(app, resources={r"*": {"origins": "*"}}, support_credentials=True)
    app.config['CORS_HEADERS'] = 'Content-Type'
    return app


def get_db(app):
    # Init db
    db = SQLAlchemy(app)
    return db


app = buil_app()
db = get_db(app)

api = Api(app)
app.debug = True
cors = CORS(app)



""" 
TODO:
"""
@app.route('/load', methods=['GET'])
@cross_origin()
def load():

    print()
    print()
    print("loading")
    print()
    print()
    # response = requests.get("http://techoffice01.muc:4343/load")
    response = requests.get("http://192.168.178.45:4343/load")
    return response.json()




""" 
TODO:
"""
@app.route('/predict', methods=['POST'])
@cross_origin()
def predict():
   
    # url='http://techoffice01.muc:4343/models/' + request.json['selected_model'] + '/predict'
    url='http://192.168.178.45:4343/models/' + request.json['selected_model'] + '/predict'
    byte_image_string = str.encode((request.json['input_data']))
    
    binaryString = base64.decodebytes(byte_image_string)
    ####################################
    ############ Testing ###############
    ####################################
    # raw_request = request.json['input_data']
    
    # with open('C:/Users/q493358/Desktop/request1.txt', 'w') as f:
    #     f.write(raw_request)
    # with open('C:/Users/q493358/Desktop/request1.txt', "rb") as f:
    #     bn_image_tri  = f.read()   
    #     f.closed
    
    # with open('C:/Users/q493358/Desktop/request1.txt', "rb") as f:
    #     bn_image_smurf = f.read()   
    #     f.closed
    # # byte_image_string = str.encode((str_image_smurf))
    # binaryString = base64.decodebytes(bn_image_tri)
    # string_from_json = str(binaryString)
    
    # import PIL.Image as Image
    # from io import BytesIO
    # im = Image.open(BytesIO(binaryString))
    # im.show()
    
    # model = "Smerf09_new_resnet50-frcnn_resnet_50"
    # model = "DH_TUM_V3_210922_Testtraining-frcnn_resnet_50"  
    # image_file = "C:/Users/q493358/Desktop/0b71886c-bfe2-4cc8-aef0-daff19651aca.jpg"
    # image_file = "C:/Users/q493358/Desktop/25_Tri_Tetra.jpg"
   
    # url = 'http://techoffice01.muc:4343/models/' + model + '/predict'
    
    # with open(image_file, "rb") as f:
    #     binaryString_tri = f.read()           
    # string_from_desktop = str(binaryString_tri)

    ###################################
    payload = {'input_data': binaryString}
    response = requests.post(url, files=payload)

    content = response.text
    content = content .replace("'", "\"")
    content = json.loads(content)
    
    return jsonify(content)


""" 
TODO:
"""
@app.route('/predict_image', methods=['POST'])
@cross_origin()
def predictImage():

    # model_name = "smurfs_001-frcnn_resnet_50"
    # url='http://techoffice01.muc:4343/models/' + model_name + '/predict_image'
    # image_file = "C:/Users/q493358/Desktop/0b71886c-bfe2-4cc8-aef0-daff19651aca.jpg"
   
    # with open(image_file, "rb") as f:
    #     im_bytes = f.read()        
    # data = {'input_data': im_bytes}
    # response = requests.post(url, files=data)
 
    # content = response.content    
    # encoded = base64.b64encode(content)
    
    # raw_request = base64.b64encode((request.json['input_data']).encode("utf-8"))
    # raw_request = str(request.json['input_data'])
    # with open('C:/Users/q493358/Desktop/request1.txt', 'w') as f:
    #     f.write(raw_request)
        
    
    # with open('C:/Users/q493358/Desktop/request1.txt', 'r') as file:
    #     data = file.read().replace('\n', '')
    # # from io import BytesIO
    # with open('C:/Users/q493358/Desktop/request1.txt', "rb") as f:
    #     im_bytes1 = f.read()   
    #     f.closed
    import base64

    byte_image_string = str.encode(str(request.json['input_data']))
    # Convert base64_image_string to byte object
    binaryString = base64.decodebytes(byte_image_string)
 

    # import PIL.Image as Image
    # from io import BytesIO
    # im = Image.open(BytesIO(base64.b64decode(im_bytes1)))
    # im.show()
    # model_name = "smurfs_001-frcnn_resnet_50"
    #url='http://techoffice01.muc:4343/models/' + str(request.json['selected_model']) + '/predict_image'
    url='http://192.168.178.45:4343/models/' + str(request.json['selected_model']) + '/predict_image'

    payload = {'input_data': binaryString}
    response = requests.post(url, files=payload)
    binaryStringFromResponse = response.content    
    base64String= base64.b64encode(binaryStringFromResponse)
    
    
    # # with open('C:/Users/q493358/Desktop/test.txt', "rb") as image_file:
    #     encoded = base64.b64encode(image_file.read())
    
    # with open("C:/Users/q493358/Desktop/imageToSave12.png", "wb") as fh:
    #     fh.write(base64.decodebytes(encoded))

    return base64String



if __name__ == '__main__':
      #app.run(debug=True, host='0.0.0.0', port=5010)
      app.run(debug=True, host='192.168.178.45', port=5010)