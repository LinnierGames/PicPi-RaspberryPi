userPhotosDirectory = ""
import platform
if platform.system() == 'Darwin':
    userPhotosDirectory = "/Users/esericksanc/Desktop"
elif platform.system() == 'Linux':
    userPhotosDirectory = "/home/pi/Pictures"

class MQTT:
  def __init__(self):
    self.userPhotosDirectoryDidChangeTopic = "file-system/photos/did-update"

mqtt = MQTT()