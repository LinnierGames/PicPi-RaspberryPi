var FileStore = require('./../src/FileStore');
var FileStoreManager = require('./../src/FileStoreManager');
var os = require('os');

/**
 * Dependancy injection.
 */
module.exports = class DI {

  /**
   * User directory where uploaded photos are saved.
   */
  static userPhotosDirectory() {
    if (os.type() == 'Darwin') {
      return "/Users/esericksanc/Pictures/PiPic";
    } else if (os.type() == 'Linux') {
      return "/home/pi/Pictures";
    } else {
      return "~/tmp";
    }
  }

  /**
   * User directory where metadata is stored.
   */
  static userPreferencesDirectory() {
    if (os.type() == 'Darwin') {
      return "/Users/esericksanc/PiPic";
    } else if (os.type() == 'Linux') {
      return "/home/pi/PiPic";
    } else {
      return "~/tmp";
    }
  }

  /**
   * FileStore manager configured for storing and loading uploaded images.
   */
  static injectUserPhotosFileStoreManager() {
    const store = new FileStore(this.userPhotosDirectory());
    return new FileStoreManager(store);
  }
}
