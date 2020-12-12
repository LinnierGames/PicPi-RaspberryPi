var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var MQTT = require('./../src/MQTT');
var multer  = require('multer');
var DI = require('./../src/DI');

const upload = multer({ dest: "/home/pi/Pictures/.temp" })

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
  const targetPath = path.join("/home/pi/Pictures", req.file.originalname);;

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
