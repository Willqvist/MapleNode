import fs from "fs";

export default class FileTools {
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

    public static removeLastDirectory(path :string) {
        let ret = path.split('/');
        ret.pop();
        return( ret.join('/') );
    }

    static readFile(src: string, options: string) {
        return new Promise<string>((resolve,reject) => {
            fs.readFile(src,options,(err,data)=> {
                if(err) reject(err);
                resolve(data);
            })
        })
    }
}
