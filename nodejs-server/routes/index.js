var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer  = require('multer');
var counter  = require('counter');

var MQTT = require('./../src/MQTT');
var DI = require('./../src/DI');

router.post(
  '/photos/upload', 
  (req, res, next) => {
    const upload = multer({ dest: path.join(DI.userPhotosDirectory(), ".temp/") })
    upload.array("photos")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.log("A Multer error occurred when uploading: ", err)
      } else if (err) {
        console.log("An unknown error occurred when uploading: ", err)
      }
   
      // Everything went fine.
      next();
    });
  }, 
  function(req, res) {
    const isPayloadEmpty = Object.keys(req.files).length === 0;
    if (isPayloadEmpty) {
      res.status(400).json({ message: "format is incorrect" });
      return
    }

    var renamingCount = counter(0)
    var errorWasThrown = false

    for (file of req.files) {
      renamingCount.value += 1

      const tempPath = file.path;
      const targetPath = path.join(DI.userPhotosDirectory(), file.originalname);

      fs.rename(tempPath, targetPath, err => {
        if (err) errorWasThrown = true;
        renamingCount.value -= 1
      });
    }

    renamingCount.once('target', function() {
      if (errorWasThrown) return res.status(500).json({ message: err });

      const mqtt = new MQTT('localhost');
      mqtt.publish("OK", 'file-system/photos/did-update')

      res
        .status(200)
        .json({ message: "Success!" });
    }).start();
  }
);

module.exports = router;
