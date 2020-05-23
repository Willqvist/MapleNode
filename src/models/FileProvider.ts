import mime from 'mime-types';
import { File } from '../core/Interfaces/Interfaces.js';
import FileTools from '../core/tools/FileTools';
import DBConn from '../core/database/DatabaseConnection';

export default class FileProvider {
  static async moveFile(src: string, dest: string) {
    console.log('moving:', src, 'to:', dest);
    await FileTools.move(src, `public/${dest}`);
    await DBConn.instance.addFile(dest, []);
  }
}
