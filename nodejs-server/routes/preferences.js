var express = require('express');
var router = express.Router();

var FileStore = require('../src/FileStore');
var DI = require('../src/DI');

const userDirectory = new FileStore(DI.userPreferencesDirectory(), { create: true });
const PREFERENCES_FILENAME = "preferences.txt";
const DEFAULT_PREFERENCES = { 
  name: "My PiPic", 
  slideshowDuration: 500
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
    if (name) {
      currentPreferences.name = name;
    }
    const slideshowDuration = req.body.slideshowDuration;
    if (slideshowDuration) {
      currentPreferences.slideshowDuration = slideshowDuration;
    }

    var jsonData = JSON.stringify(currentPreferences);
    userDirectory.store(jsonData, PREFERENCES_FILENAME)
      .then(() => {
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
