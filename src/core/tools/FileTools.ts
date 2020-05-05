import fs, { PathLike } from 'fs';
import { File } from '../Interfaces/Interfaces';
import mime from 'mime-types';
/**
 * Helper class for file handling.
 */
export default class FileTools {
  /**
   * moves a file at src to dest
   * @param src src of the file to move
   * @param dest the destination to move the file to.
   */
  public static async move(src: string, dest: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let dir = this.removeLastDirectory(dest);
      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) reject(err);
        fs.copyFile(src, dest, (err) => {
          if (err) reject(err);
          fs.unlink(src, (err) => {
            if (err) reject(err);
            resolve(true);
          });
        });
      });
    });
  }

  public static async readDir(dir: PathLike): Promise<File[]> {
    return new Promise<File[]>((resolve, reject) => {
      fs.readdir(dir, (err, files) => {
        if (err) return reject(err);
        let res: File[] = [];
        for (let i in files) {
          const file = files[i];
          const mimeType = mime.extname(file);
          res.push({
            fileName: file,
            mimetype: mimeType,
            destName: dir + file,
          });
        }
        resolve(res);
      });
    });
  }

  /**
   * writes utf8 data to a file
   * @paramm dest the destination file to write to.
   * @param src the data to write to the file. will be written as utf8.
   */
  public static async write(dest: string, src: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(dest, src, 'utf8', (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  /**
   * removed the last directory from a path. ex. a/b/c becomes a/b
   * @param path the path to remove last directory from.
   */
  public static removeLastDirectory(path: string) {
    let ret = path.split('/');
    ret.pop();
    return ret.join('/');
  }

  /**
   * reads data from a file
   * @param src the destination of the file to read.
   * @param options read options. ex. read as utf8.
   */
  static readFile(src: string, options: string) {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(src, options, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  /**
   * checks if a file exists, true if it exists.
   * @param path, path to the file.
   */
  static async exists(path: string) {
    return new Promise<boolean>((resolve) => {
      fs.access(path, fs.constants.R_OK, (err) => {
        resolve(!err);
      });
    });
  }
}
