var fs = require('fs');
var path = require('path');

/**
 * Read, store and peak contents of a folder given a directory file path.
 */
module.exports = class FileStore {
  #directory;

  constructor(directory, options = {}) {
    try {
      const exists = fs.existsSync(directory);
      if (exists) {
        if (!fs.lstatSync(directory).isDirectory()) {
          throw "file path is not a directory";
        }
      } else if (options.create) {
        fs.mkdirSync(directory);
      }
    } catch (error) {
      if (options.create) {
        fs.mkdirSync(directory);
      } else {
        throw "file path is not found";
      } 
    }

    this.#directory = directory;
  }

  get path() {
    return this.#directory;
  }

  filenames() {
    return fs.readdirSync(this.#directory);
  }

  stats(filename) {
    return fs.statSync(this.appendFilename(filename));
  }

  doesFilenameExist(filename) {
    try {
      if (fs.existsSync(this.appendFilename(filename))) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  load(filename) {
    return fs.readFileSync(this.appendFilename(filename));
  }

  store(data, filename) {
    const path = this.appendFilename(filename)
    console.log(`saving data to: ${path}`);
    const promise = new Promise((resolve, reject) => {
      try {
        fs.writeFile(path, data, () => {
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });

    return promise
  }

  deleteFilename(filename) {
    const path = this.appendFilename(filename)
    console.log(`deleting data from: ${path}`);
    const promise = new Promise((resolve, reject) => {
      try {
        fs.unlink(path, (err) => {
          if (!err) {
            return resolve();
          }

          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });

    return promise
  }

  appendFilename(filename) {
    return path.join(this.#directory, filename);
  }
}
