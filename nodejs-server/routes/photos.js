var counter  = require('counter');
var express = require('express');
var fs = require('fs');
var multer  = require('multer');
var path = require('path');
var router = express.Router();

var MQTT = require('../src/MQTT');
var DI = require('../src/DI');

router.get(
  '/', 

  // Handle loading all filenames stored in the user directory.
  function(req, res) {
    userDirectory = FileStore(DI.userPhotosDirectory());
    filenames = userDirectory.filenames();

    host = "http://localhost"
    var urls = map(filenames, (filename) => {
      refurn `{host}/photos/{filename}`;
    });

    res
        .status(200)
        .json(urls);
  }
);

router.post(
  '/upload', 

  // Handle multipart upload.
  (req, res, next) => {
    const upload = multer({ dest: path.join(DI.userPhotosDirectory(), ".temp/") });
    upload.array("photos")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.log("A Multer error occurred when uploading: ", err);
      } else if (err) {
        console.log("An unknown error occurred when uploading: ", err);
      }

      // Everything went fine.
      next();
    });
  }, 

  // Handle uploaded image and notifying photos did-update event.
  function(req, res) {
    if (req.files === undefined) {
      res
        .status(400)
        .json({ message: "format is incorrect" });
      return;
    }
    if (req.files.length == 0) {
      res
        .status(400)
        .json({ message: "no images" });
      return;
    }

    var savedFilenames = [];
    var renamingCount = counter(0);
    var errors = [];

    for (file of req.files) {
      renamingCount.value += 1;

      const tempPath = file.path;
      const targetPath = path.join(DI.userPhotosDirectory(), file.originalname);

      fs.rename(tempPath, targetPath, (err) => {
        if (err) errors.push(err);
        savedFilenames.push(file.originalname);
        renamingCount.value -= 1;
      });
    }

    renamingCount.once('target', function() {
      if (errors.length != 0) {
        return res
          .status(500)
          .json({ message: "something went wrong", errors: errors });
      }

      const mqtt = new MQTT('localhost');
      mqtt.publish("OK", 'file-system/photos/did-update');

      res
        .status(201)
        .json({ message: "Success!", filenames: savedFilenames });
    }).start();
  }
);

module.exports = router;
