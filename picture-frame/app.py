# from folder.subfolder.module import something_in_the_module

from mqtt import client as mqtt
from rootcontroller import Application
import di

app = Application(di.userPhotosDirectory)

def mqtt_on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    mqtt.subscribe(di.mqtt.userPhotosDirectoryDidChangeTopic)

def mqtt_on_message(client, userdata, msg):
    if msg.topic == di.mqtt.userPhotosDirectoryDidChangeTopic:
        app.restart_slideshow()

mqtt.on_message = mqtt_on_message
mqtt.on_connect = mqtt_on_connect
mqtt.loop_start()

app.mainloop()
