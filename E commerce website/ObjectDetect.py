import keys
import requests


def detect_object(img):
    url = "https://objects-detection.p.rapidapi.com/objects-detection"

    payload = { "url": img }
    headers = {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": keys.objectdetectionKey,
        "X-RapidAPI-Host": "objects-detection.p.rapidapi.com"
    }

    response = requests.post(url, data=payload, headers=headers)

    print(response.json())
    json_data=response.json()
    def segregate_key_with_highest_confidence(json_data):
        highest_confidence = 0
        key_with_highest_confidence = None
        for label in json_data['body']['labels']:
            confidence = label['Confidence']
            if confidence > highest_confidence:
                highest_confidence = confidence
                key_with_highest_confidence = label['Name']
        return key_with_highest_confidence
    key_with_highest_confidence = segregate_key_with_highest_confidence(json_data)
    print("Key with highest confidence:", key_with_highest_confidence)
    return key_with_highest_confidence

