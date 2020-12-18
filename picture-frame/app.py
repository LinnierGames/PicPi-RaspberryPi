# from folder.subfolder.module import something_in_the_module

from mqtt import client as mqtt
import tkinter as tk
from rootcontroller import Application
import di

window = tk.Tk()
app = Application(window, di.userPhotosDirectory)

def mqtt_on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    mqtt.subscribe(di.mqtt.userPhotosDirectoryDidChangeTopic)

def mqtt_on_message(client, userdata, msg):
    if msg.topic == di.mqtt.userPhotosDirectoryDidChangeTopic:
        app.restart_slideshow()

mqtt.on_message = mqtt_on_message
mqtt.on_connect = mqtt_on_connect
mqtt.loop_start()

def exit_app(event):
    window.attributes("-fullscreen", False)
    window.destroy()

window.bind("<Escape>", exit_app)

window.attributes("-fullscreen", True)
window.config(cursor='none')
window.mainloop()
