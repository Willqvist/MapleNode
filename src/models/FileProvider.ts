import fs from 'fs';
import FileTools from '../core/tools/FileTools';
import DBConn from '../core/database/DatabaseConnection';
import { TaggedFile } from '../core/Interfaces/Interfaces';

const ROOT = './public/upload/';
const PUBLIC_ROOT = 'upload/';
function path(pth: string) {
  return ROOT + pth;
}
export default class FileProvider {
  private static cache: { [key: string]: TaggedFile } = {};

  private static tagCache: { [key: string]: string } = {};

  private static files: TaggedFile[] = null;

  private static tags: string[] = null;

  static async moveFile(src: string, dest: string) {
    await FileTools.move(src, path(dest));
    await this.addFile(dest, []);
  }

  private static clearCache(file: string) {
    this.files = null;
    if (this.cache[file]) {
      const { tags } = this.cache[file];
      for (let i = 0; i < tags.length; i++) {
        this.tagCache[tags[i]] = null;
      }
      this.cache[file] = null;
    }
  }

  static async deleteFile(file: string) {
    return new Promise((resolve) => {
      const realPath = path(file);
      this.clearCache(file);
      DBConn.instance.deleteFile(file).then(() => {
        fs.unlink(realPath, () => {
          resolve(true);
        });
      });
    });
  }

  static async tagFile(file: string, tag: string) {
    this.tagCache[tag] = file;
    this.files = null;
    await DBConn.instance.tagFile(file, tag);
  }

  static async getTags(file: string) {
    if (this.cache[file]) return this.cache[file].tags;
    return DBConn.instance.getTags(file);
  }

  static async addFile(file: string, tags: string[]) {
    const res = await DBConn.instance.addFile(file, tags);
    res.destName = PUBLIC_ROOT+res.fileName;
    this.cache[file] = res;
    this.files = null;
    for (let i = 0; i < res.tags.length; i++) {
      this.tagCache[res.tags[i]] = file;
    }
    return res;
  }

  static async getTaggedFile(tag: string): Promise<TaggedFile> {
    console.log("TAG: ",tag, "CACHE:",this.cache[this.tagCache[tag]]);
    if (this.tagCache[tag]) return this.cache[this.tagCache[tag]];
    let file = (await DBConn.instance.getFilesByTag(tag))[0];
    if (!file) {
      file = {
        fileName: 'none.png',
        destName: 'images/none.png',
        mimetype: '.png',
        tags: [tag],
      };
    } else {
      file.destName = PUBLIC_ROOT + file.fileName;
    }
    console.log(file);
    this.cache[file.fileName] = file;
    this.tagCache[tag] = file.fileName;
    return file;
  }

  static async getTaggedFiles() {
    if (this.files) return this.files;
    this.files = (await DBConn.instance.getFilesWithTag()).filter(
      (file) => (file.destName = PUBLIC_ROOT + file.fileName)
    );
    return this.files;
  }

  static async addTag(tag: string) {
    this.tags = null;
    await DBConn.instance.addTag(tag);
  }

  static async getAllTags(): Promise<string[]> {
    if (this.tags) return this.tags;
    this.tags = await DBConn.instance.getAllTags();
    return this.tags;
  }
}
