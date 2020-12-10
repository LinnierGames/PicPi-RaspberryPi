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
  fs.writeFile(dirPath, data, completion);  
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'Express' });
});

router.post('/photos/upload', function(req, res, next) {
  // get data
  const payload = req.body;
  // type check data
  if (true != true) {
    return res.status(400).json({ message: "format is incorrect" });
  }
  // create photos directory if needed

  mkdirpath("./Photos")
  // save photo in directory
  const filenameDirectory = "path"
  saveDataToFile(payload, filenameDirectory, (err) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: "photo is saved" });
  });
  // respond success
});


module.exports = router;
