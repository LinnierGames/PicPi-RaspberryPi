var express = require('express');
var router = express.Router();

// Get modules node
const fs   = require('fs');
const path = require('path');

// Create 
function mkdirpath(dirPath)
{
    if(!fs.accessSync(dirPath, fs.constants.R_OK | fs.constants.W_OK))
    {
        try
        {
            fs.mkdirSync(dirPath);
        }
        catch(e)
        {
            mkdirpath(path.dirname(dirPath));
            mkdirpath(dirPath);
        }
    }
}

function saveDataToFile(dirPath, data, completion) {
  completion(null)
  // fs.writeFile(dirPath, data, completion);  
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'Express' });
});

router.post('/photos/upload', function(req, res, next) {
  // get data
  const payload = req.body;
  const isPayloadEmpty = Object.keys(payload).length === 0;
  if (isPayloadEmpty) {
    res.status(400).json({ message: "format is incorrect" });
    return
  }

  const payloadSize = Buffer.byteLength(String(payload.image), 'utf8');
  res.status(201).json({ message: "new image received!", payload: `Size: ${payloadSize} bytes` });

  const mqttTopic = "file-system/photos/did-update"

  var mqtt = require('mqtt')
  var client  = mqtt.connect('localhost')
  
  client.on('connect', function () {
    console.log("connected!")
    client.publish(mqttTopic, 'Hello mqtt')
  });

  // type check data
  // if (true != true) {
  //   return res.status(400).json({ message: "format is incorrect" });
  // }
  // create photos directory if needed
  // const photosDirectory = "path"
  // const filenameDirectory = "path"

  // mkdirpath(photosDirectory)
  // // save photo in directory
  // saveDataToFile(payload, filenameDirectory, (err) => {
  //   if (err) return res.status(500).json(err);
  //   res.status(201).json({ message: "photo is saved" });
  // });
  // respond success
});


module.exports = router;
