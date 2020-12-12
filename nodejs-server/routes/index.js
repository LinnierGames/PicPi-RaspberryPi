var express = require('express');
var router = express.Router();
var DI = require('./../src/DI');

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
