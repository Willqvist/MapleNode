import fs from "fs";
import ErrnoException = NodeJS.ErrnoException;
import {HOME} from "../../Paths";

/**
 * Helper class for file handling.
 */
export default class FileTools {

    /**
     * moves a file at src to dest
     * @param src src of the file to move
     * @param dest the destination to move the file to.
     */
    public static async move(src  : string, dest: string) : Promise<boolean> {
        return new Promise<boolean>((resolve,reject) => {
            let dir = this.removeLastDirectory(dest);
            fs.mkdir(dir, { recursive: true }, (err)=> {
                if (err) reject(err);
                fs.copyFile(src, dest, (err) => {
                    if (err) reject(err);
                    fs.unlink(src,(err)=> {
                        if (err) reject(err);
                        resolve(true);
                    });
                });
            });
        });
    }

    /**
     * writes utf8 data to a file
     * @param dest the destination file to write to.
     * @param src the data to write to the file. will be written as utf8.
     */
    public static async write(dest : string, src: string) : Promise<void> {
        return new Promise<void>((resolve,reject) =>
        {
           fs.writeFile(dest,src,"utf8",(err)=>{
               if(err) reject(err);
               resolve();
           });
        });
    }

    /**
     * removed the last directory from a path. ex. a/b/c becomes a/b
     * @param path the path to remove last directory from.
     */
    public static removeLastDirectory(path :string) {
        let ret = path.split('/');
        ret.pop();
        return( ret.join('/') );
    }

    /**
     * reads data from a file
     * @param src the destination of the file to read.
     * @param options read options. ex. read as utf8.
     */
    static readFile(src: string, options: string) {
        return new Promise<string>((resolve,reject) => {
            fs.readFile(src,options,(err,data)=> {
                if(err) reject(err);
                resolve(data);
            })
        })
    }
}
