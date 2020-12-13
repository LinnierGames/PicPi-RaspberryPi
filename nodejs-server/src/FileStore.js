var fs = require('fs');
var path = require('path');

/**
 * Read, store and peak contents of a folder given a directory file path.
 */
module.exports = class FileStore {
  #directory;

  constructor(directory) {
    try {
      if (fs.existsSync(directory)) {
        if (!fs.lstatSync(directory).isDirectory()) {
          throw "file path is not a directory";
        }
      }
    } catch {
      throw "file path is not found";
    }

    this.#directory = directory;
  }

  get path() {
    return this.#directory;
  }

  filenames() {
    return fs.readdirSync(this.#directory);
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

  loadFilename(filename) {
    return undefined;
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

  appendFilename(filename) {
    return path.join(this.#directory, filename);
  }
}
