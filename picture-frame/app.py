# from folder.subfolder.module import something_in_the_module

from mqtt import client
from rootcontroller import app

# def main():
#   app.after(1000, main)

# files_did_change_event = app.restart_slideshow
def on_message(client, userdata, msg):
    if msg.topic == "file-system/photos/did-update":
        app.restart_slideshow()
            
client.on_message = on_message
client.loop_start()


# app.after(1000, main)
# start()
app.mainloop()
