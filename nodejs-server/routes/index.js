var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer  = require('multer');
var counter  = require('counter');

var MQTT = require('./../src/MQTT');
var DI = require('./../src/DI');

const upload = multer({ dest: path.join(DI.userPhotosDirectory(), ".temp/") })

router.post(
  '/photos/upload-3', 
  (req, res, next) => {
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
      console.log("renaming file")
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

router.post('/photos/upload-2', upload.single("file"), function(req, res, next) {
  const isPayloadEmpty = Object.keys(req.file).length === 0;
  if (isPayloadEmpty) {
    res.status(400).json({ message: "format is incorrect" });
    return
  }

  if (req.file.path === undefined) {
    res.status(400).json({ message: "missing image" });
    return
  }

  if (req.file.filename === undefined) {
    res.status(400).json({ message: "missing filename" });
    return
  }

  const tempPath = req.file.path;
  const targetPath = path.join(DI.userPhotosDirectory(), req.file.originalname);;

  fs.rename(tempPath, targetPath, err => {
    if (err) return res.status(500).json({ message: err });

    const mqtt = new MQTT('localhost');
    mqtt.publish("OK", 'file-system/photos/did-update')

    res
      .status(200)
      .json({ message: "Success!", filename: req.file.originalname });
  });
});

router.post('/photos/upload', function(req, res, next) {
  const isPayloadEmpty = Object.keys(req.body).length === 0;
  if (isPayloadEmpty) {
    res.status(400).json({ message: "format is incorrect" });
    return
  }

  if (req.body.image === undefined) {
    res.status(400).json({ message: "missing image" });
    return
  }

  if (req.body.filename === undefined) {
    res.status(400).json({ message: "missing filename" });
    return
  }

  const payload = { image: req.body.image, filename: req.body.filename };
  const manager = DI.injectUserPhotosFileStoreManager()

  manager.store(payload.image, payload.filename)
    .then((filename) => {
      const payloadSize = Buffer.byteLength(String(payload.image), 'utf8');
      res.status(201).json({ filename: filename, payload: `Size: ${payloadSize} bytes` });
    })
    .catch((err) => {
      res.status(500).json({ message: `failed to store image: ${err}` });
    })
});

module.exports = router;
