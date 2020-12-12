# from folder.subfolder.module import something_in_the_module

from mqtt import client
from rootcontroller import app

# def main():
#   app.after(1000, main)

client.loop_start()

# app.after(1000, main)
# start()
app.mainloop()
