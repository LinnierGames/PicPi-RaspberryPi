# from folder.subfolder.module import something_in_the_module

from mqtt import client
from rootcontroller import Application

import platform
if platform.system() == 'Darwin':
    photos_dir = "/Users/esericksanc/Desktop"
elif platform.system() == 'Linux':
    photos_dir = "/home/pi/Pictures"

app = Application(photos_dir)

def on_message(client, userdata, msg):
    if msg.topic == "file-system/photos/did-update":
        app.restart_slideshow()
client.on_message = on_message

client.loop_start()
app.mainloop()
