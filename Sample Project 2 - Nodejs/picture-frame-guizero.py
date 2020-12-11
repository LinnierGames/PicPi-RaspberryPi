from guizero import App, Text, PushButton, Picture, system_config, Drawing
print(system_config.supported_image_types)

app = App(title="PicPi")
title = Text(app, text="Welcome to PicPi!")

def pressRefresh():
    print("Refresh!")
refreshButton = PushButton(app, text="Refresh", command=pressRefresh)

# slideshow = Picture(app, image="photos/image3.png", width=200, height=300)

# draw = Drawing(app)
# draw.image(0,0, image="photos/image2.png", width=200, height=300)

from PIL import Image

image = Image.open("photos/image3.png")
image.show()

app.display()