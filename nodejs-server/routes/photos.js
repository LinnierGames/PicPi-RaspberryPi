var counter  = require('counter');
var express = require('express');
var fs = require('fs');
var multer  = require('multer');
var path = require('path');
var router = express.Router();
var sharp = require('sharp');

var FileStore = require('../src/FileStore');
var DI = require('../src/DI');

router.get(
  '/', 

  // Handle loading all filenames stored in the user directory.
  function(req, res) {
    const userDirectory = new FileStore(DI.userPhotosDirectory(), { create: true });
    const filenames = userDirectory.filenames();

    const imageFilenames = filenames.filter((filename) => {
      const extension = path.extname(filename).toLowerCase();
      return (extension == ".png" || extension == ".jpeg" || extension == ".jpg");
    });

    const protocol = req.protocol;
    const host = req.headers.host;
    var urls = imageFilenames.map((filename) => {
      return `${protocol}://${host}/photos/${filename}`;
    });

    res
      .status(200)
      .json(urls);
  }
);

router.get(
  '/:filename', 
  // "/avatar.png?thumbnail=true&scale=3"

  // Handle loading and servering images.
  function(req, res) {
    const filename = req.params.filename;
    const requestingAsThumbnail = (req.query.thumbnail == 'true');
    var scale = req.query.scale;
    if (scale === undefined) {
      scale = 1;
    }

    if (requestingAsThumbnail) {
      sharp(path.join(DI.userPhotosDirectory(), filename))
        .resize(164 * scale, 164 * scale, { fit: sharp.fit.inside })
        .toBuffer()
        .then((outputBuffer) => {
          res
            .status(200)
            .contentType("image/png")
            .send(outputBuffer);
        })
        .catch((err) => {
          res
            .status(500)
            .sendFile(err);
        });
    } else {
      res
        .status(200)
        .sendFile(path.join(DI.userPhotosDirectory(), filename));
    }
  }
);

router.delete(
  '/:filename', 
  // "/avatar.png"

  // Handle loading and servering images.
  function(req, res) {    
    const filename = req.params.filename;
    return res.status(503).json({ message: "not yet implemented", test: { filename }});

    // TODO: Read from disk the image.

    const userDirectory = FileStore(DI.userPhotosDirectory());
    userDirectory.deleteFilename(filename)
      .then(() => {
        res
          .status(200)
          .send(imageData);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: err });
      });
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
