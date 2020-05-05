import fs from 'fs';

export default class MNHandler {
  static checkForFile(fileName) {
    return new Promise((resolve) => {
      if (!fs.existsSync('settings')) {
        fs.mkdirSync('settings');
      }
      fs.access('settings', fs.constants.F_OK, (err) => {
        if (err) {
          fs.mkdirSync('settings');
        }
        fs.access(fileName, fs.constants.F_OK, (access) => {
          if (!access) {
            resolve(true);
          } else {
            fs.writeFile(fileName, '', (errWrite) => {
              if (errWrite) resolve(false);
              resolve(true);
            });
          }
        });
      });
    });
  }
}
