import ObjectDetect as od
import ImageGeneration as IG
from flask import request,Flask,jsonify
from flask_cors import CORS
import json
import keys

"""
At the command line, only need to run once to install the package via pip:

$ pip install google-generativeai
"""

import pathlib
import textwrap

import google.generativeai as genai

from IPython.display import display
from IPython.display import Markdown
import json
from flask import Flask, render_template, jsonify

app = Flask(__name__)
CORS(app)

def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

# Assuming you have your GenerativeAI code here (replace with yours)
def generate_json_data(object):
    # ImageGeneration.create_img()
    genai.configure(api_key=keys.geminiKey)

    # Set up the model
    generation_config = {
      "temperature": 0.9,
      "top_p": 1,
      "top_k": 1,
      "max_output_tokens": 2048,
    }

    safety_settings = [
      {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
      },
    ]

    model = genai.GenerativeModel(model_name="gemini-1.0-pro",
                                  generation_config=generation_config,
                                  safety_settings=safety_settings)
    # object="mobile phone"
    # prompt="Your job is to gather all the information regarding Iphone over internet to get their price,description,genuinue ratings,category of the product in json format"
    # response = model.generate_content("%s".format(prompt)) 
    # prompt="ask Description: We have a dataset containing information about mobile phone of realme. Your task is to provide details about the genuine price, description, and ratings of each product.Prompt:You will be provided with a  containing information about different products. Each entry in the dataset includes details such as the product's title, category, description, price, and user ratings. Your task is to analyze this dataset and extract the following information for each product:Genuine Price: Identify the actual price of the product. Sometimes, products may have inflated or incorrect prices listed, and you need to determine the genuine price based on available information.Description: Provide a concise summary or description of each product based on the information available in the dataset. This description should capture the essence of the product and its key features.Ratings: Determine the user ratings for each product. This could involve analyzing user reviews, ratings, or any other relevant data available in the dataset.Your output should include the genuine price, description, and ratings for each product. Ensure that your analysis is accurate and comprehensive, providing valuable insights into each product for further decision-making.Additional Guidelines:Pay attention to details and ensure accuracy in your analysis.Use appropriate methods and techniques to extract relevant information from the dataset.Provide clear and concise descriptions for each product.Consider any potential challenges or ambiguities in the dataset and address them effectively.Aim to deliver high-quality results that can be used for decision-making purposes."
    # object="mobile phone"
    prompt=f"your job is to design a json file which do contain all the information of  the product {object} like price with key price ,description with key desc,ratings with key rate,product name with key product and create a json file in this directory as well".format(object)
    response=model.generate_content(prompt)
    fin = response.text.lstrip('`').lstrip("json").rstrip('`')
    json_data = json.loads(fin)
    return json_data


def get_json():
    product_info = generate_json_data()
    print(product_info)
    return jsonify(product_info)

@app.route('/')
def index():
    return render_template('test.html')

@app.route('/process_image', methods=['POST'])
def process_image():
    data = request.json
    image_url = data.get('imageUrl')
    
    object_name = od.detect_object(image_url)
    desc_text = generate_json_data(object_name)
    IG.create_img(image_url)
    # Return a response with the description text
    # return desc_text
    return jsonify({'description': desc_text,'img': 'output.png'})

    

if __name__ == '__main__':
    app.run(debug=True)  # Set debug=False for production


