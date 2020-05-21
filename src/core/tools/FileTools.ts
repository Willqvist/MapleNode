import fs, { PathLike } from 'fs';
import mime from 'mime-types';
import { File } from '../Interfaces/Interfaces';
import { pipe, fun, waitFor } from './Utils';
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
    const dir = this.removeLastDirectory(dest);
    const errCallback = (err) => {
      if (err) {
        throw err;
      }
      return true;
    };

    const complete = (err) => {
      if (err) {
        throw err;
      }
      return true;
    };

    await pipe(
      fun(fs.mkdir).props(dir, { recursive: true }, waitFor(errCallback)).stopOnError(),
      fun(fs.copyFile).props(src, dest, waitFor(errCallback)).stopOnError(),
      fun(fs.unlink).props(src, waitFor(complete)).stopOnError()
    );
    return true;
    /*
      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) reject(err);
        fs.copyFile(src, dest, (errCopy) => {
          if (errCopy) reject(errCopy);
          fs.unlink(src, (err) => {
            if (err) reject(err);
            resolve(true);
          });
        });
      });
       */
  }

  public static async readDir(dir: PathLike): Promise<File[]> {
    return new Promise<File[]>((resolve, reject) => {
      fs.readdir(dir, (err, files) => {
        if (err) return reject(err);
        const res: File[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const content = mime.contentType(file);
          const mimeType = content ? mime.extension(content) : false;
          res.push({
            fileName: file,
            mimetype: mimeType,
            destName: `${dir}/${file}`,
          });
        }
        resolve(res);
      });
    });
  }

  /**
   * returns true if file is of type image.
   * true on png,jpg,gif.
   * @param file
   */
  public static isImage(file: File) {
    const mime = file.mimetype;
    return mime === 'png' || mime === 'jpg' || mime === 'gif';
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
    const ret = path.split('/');
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
