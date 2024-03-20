import requests
from PIL import Image
from io import BytesIO

def create_img(url):
    from rembg import remove
    import easygui
    from PIL import Image

    def open_image_from_url(url):
        try:
            response = requests.get(url)
            if response.status_code == 200:
                image = Image.open(BytesIO(response.content))
                return image
            else:
                print("Failed to fetch image. Status code:", response.status_code)
        except Exception as e:
            print("Error:", e)
        return None
    image = open_image_from_url(url)
    output = remove(image,color="white")
    output.save ("output.png")

