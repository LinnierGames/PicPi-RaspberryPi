var MQTT = require('./MQTT');
  
/**
 * Manage storing files.
 */
module.exports = class FileStoreManager {
  #fileStore;
  #pendingFilenames = {};
  #mqtt;

  constructor(fileStore) {
    this.#fileStore = fileStore;
    this.#mqtt = new MQTT('localhost');
  }

  /**
   * Store the give data in a queue. "-1" would be added if the given
   * filename already exsits or is in-progress of saving.
   */
  store(data, filename) {
    var filenameExists = false;
    if (this.#fileStore.doesFilenameExist(filename)) {
      filenameExists = true;
    }
    if (filename in this.#pendingFilenames) {
      filenameExists = true;
    }

    var filenameToUse = filename;
    if (filenameExists) {
      filenameToUse = this.dedupFilename(filename);

      while (this.#fileStore.doesFilenameExist(filenameToUse)) {
        filenameToUse = this.dedupFilename(filenameToUse);
      }
    }

    this.#pendingFilenames[filenameToUse] = true;

    const self = this;
    return this.#fileStore.store(data, filenameToUse)
      .then(() => {
        delete self.#pendingFilenames[filenameToUse];
        self.#mqtt.publish("OK", 'file-system/photos/did-update');
        return filenameToUse;
      })
      .catch((err) => {
        delete self.#pendingFilenames[filenameToUse];
      })
  }

  dedupFilename(filename) {
    const components = filename.split('.');
    const name = components[0];

    if (components.length == 1) {
      return name + "-1";
    } else {
      return name + "-1" + "." + components[1];
    }
  }
}
