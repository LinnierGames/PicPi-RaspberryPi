var FileStore = require('./../src/FileStore');
var FileStoreManager = require('./../src/FileStoreManager');

const userPhotosDirectory = "/home/pi/Pictures"

/**
 * Dependancy injection.
 */
module.exports = class DI {
  /**
   * FileStore manager configured for storing and loading uploaded images.
   */
  static injectUserPhotosFileStoreManager() {
    const store = new FileStore(userPhotosDirectory);
    return new FileStoreManager(store)
  }
}