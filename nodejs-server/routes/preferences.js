var express = require('express');
var router = express.Router();

var FileStore = require('../src/FileStore');
var DI = require('../src/DI');
var MQTT = require('../src/MQTT');
const mqtt = new MQTT('localhost');

const userDirectory = new FileStore(DI.userPreferencesDirectory(), { create: true });
const PREFERENCES_FILENAME = "preferences.txt";
const DEFAULT_PREFERENCES = {
  name: "My PiPic",
  slideshowDuration: 500,
  portraitMode: false,
  connectionPasscode : "1234",
 };

router.get(
  '/',

  // Handle populating the user preferences into req.userPreferences.
  attachPreferences,

  // Handle serving the user preferences.
  function(req, res) {
    res
      .status(200)
      .json(req.userPreferences);
  }
);

router.patch(
  '/',

  // Handle populating the user preferences into req.userPreferences.
  attachPreferences,

  // Handle updating the user preferences.
  function(req, res) {
    var currentPreferences = req.userPreferences;
    const name = req.body.name;
    if (name != undefined) {
      currentPreferences.name = name;
    }
    const slideshowDuration = req.body.slideshowDuration;
    if (slideshowDuration != undefined) {
      currentPreferences.slideshowDuration = slideshowDuration;
    }
    const connectionPasscode = req.body.connectionPasscode;
    if (connectionPasscode != undefined) {
      currentPreferences.connectionPasscode = connectionPasscode;
    }
    const portraitMode = req.body.portraitMode;
    if (portraitMode != undefined) {
      currentPreferences.portraitMode = portraitMode;
    }
    var jsonData = JSON.stringify(currentPreferences);
    userDirectory.store(jsonData, PREFERENCES_FILENAME)
      .then(() => {
        mqtt.publish("OK", 'user-preferences/did-update');

        res
          .status(200)
          .json({ message: "OK", preferences: currentPreferences });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: err });
      });
  }
);

function attachPreferences(req, res, next) {
  const makeDefaultPreferencesAndInvokeNext = () => {
    req.userPreferences = DEFAULT_PREFERENCES;
    next();
  };

  if (userDirectory.doesFilenameExist(PREFERENCES_FILENAME)) {
    const data = userDirectory.load(PREFERENCES_FILENAME)
    if (!data) {
      return makeDefaultPreferencesAndInvokeNext();
    }

    const preferences = JSON.parse(data);
    req.userPreferences = preferences;

    next()
  } else {
    makeDefaultPreferencesAndInvokeNext();
  }
}

module.exports = router;
