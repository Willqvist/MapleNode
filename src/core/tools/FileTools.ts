import fs, { PathLike } from 'fs';
import mime from 'mime-types';
import path from 'path';
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

  /**
   * reads files from a directory and all its subdirectories.
   * @param dir, the starting dir.
   */
  public static async readDirRecursive(dir: PathLike) {
    const firstFiles = await this.readDir(dir);
    const files = await Promise.all(
      firstFiles.map((file) => {
        return file.dirent.isDirectory() ? this.readDirRecursive(file.destName) : file;
      })
    );
    return Array.prototype.concat(...files);
  }

  /**
   * reads all files inside a directory.
   * @param dir, the dir to read files from. if mimetype in File[] is false.
   * it is a directory.
   */
  public static async readDir(dir: PathLike): Promise<File[]> {
    return new Promise<File[]>((resolve, reject) => {
      fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) return reject(err);
        const res: File[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const content = mime.contentType(file.name);
          const mimeType = content ? mime.extension(content) : false;
          res.push({
            fileName: file.name,
            mimetype: mimeType,
            destName: `${dir}/${file.name}`,
            dirent: file,
          });
        }
        resolve(res);
      });
    });
  }

  /**
   * transform a path string into File object
   * @param path
   */
  static pathToFile(filePath: string): File {
    const fileName = path.basename(filePath);
    const content = mime.contentType(fileName);
    const mimeType = content ? mime.extension(content) : false;
    return {
      fileName,
      destName: filePath,
      mimetype: mimeType,
    };
  }

  /**
   * returns true if file is of type image.
   * true on png,jpg,gif, svg
   * @param file
   */
  public static isImage(file: File) {
    const mime = file.mimetype;
    return mime === 'png' || mime === 'jpg' || mime === 'gif' || mime === 'svg';
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
