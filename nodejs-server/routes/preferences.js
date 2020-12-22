var express = require('express');
var router = express.Router();

var DI = require('../src/DI');

router.get(
  '/', 

  // Handle serving the user preferences.
  function(req, res) {

    // TODO: Read from disk the preferences.

    res
      .status(200)
      .json({ name: "My PiPic", slideshowDuration: 500 });
  }
);

router.patch(
  '/', 

  // Handle updating the user preferences.
  function(req, res) {

    // TODO: Read from disk the preferences.

    var currentPreferences = { name: "My PiPic", slideshowDuration: 500 };
    const name = req.body.name;
    if (name) {
      currentPreferences.name = name;
    }
    const slideshowDuration = req.body.slideshowDuration;
    if (slideshowDuration) {
      currentPreferences.slideshowDuration = slideshowDuration;
    }

    // TODO: Write to disk the preferences.

    res
      .status(200)
      .json({ message: "OK", preferences: currentPreferences });
  }
);

module.exports = router;
