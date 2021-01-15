import platform
import json
import os.path
from os import path
from pathlib import Path

userPhotosDirectory = ""
if platform.system() == 'Darwin':
    userPhotosDirectory = "/Users/esericksanc/Desktop"
elif platform.system() == 'Linux':
    userPhotosDirectory = "/home/pi/Pictures"
else:
    userPhotosDirectory = "~/tmp"

userPreferences = ""
import platform
if platform.system() == 'Darwin':
    userPreferences = "/Users/esericksanc/PiPic/preferences.txt"
elif platform.system() == 'Linux':
    userPreferences = "/home/pi/PiPic/preferences.txt"
else:
    userPreferences = "~/tmp/pi-pic-preference.txt"

userPreferencesDirectory = ""
import platform
if platform.system() == 'Darwin':
    userPreferencesDirectory = "/Users/esericksanc/PiPic/"
elif platform.system() == 'Linux':
    userPreferencesDirectory = "/home/pi/PiPic/"
else:
    userPreferencesDirectory = "~/tmp/"

class MQTT:
  def __init__(self):
    self.userPhotosDirectoryDidChangeTopic = "file-system/photos/did-update"
    self.userPreferencesDidChangeTopic = "user-preferences/did-update"

class UserPrefernces:
  def __init__(self):
    self.picture_frame_name = "My PiPic"
    self.slide_duration = 1000
    self.portrait_mode = False
    self.connection_passcode = "1234"
    self.refresh()

  def refresh(self):
    if path.exists(userPreferences) is not True:
        default = {
            "name": "My PiPic",
            "slideshowDuration": 1000,
            "portraitMode": False,
            "connectionPasscode": "1234"
        }

        Path(userPreferencesDirectory).mkdir(parents=True, exist_ok=True)
        with open(userPreferences, 'w') as file:
            json.dump(default, file)

    with open(userPreferences) as file:
        jsonData = json.load(file)
        self.picture_frame_name = jsonData["name"]
        self.slide_duration = jsonData["slideshowDuration"]
        self.portrait_mode = jsonData["portraitMode"]
        self.connection_passcode = jsonData["connectionPasscode"]

mqtt = MQTT()
preferences = UserPrefernces()