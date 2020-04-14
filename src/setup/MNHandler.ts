import ErrnoException = NodeJS.ErrnoException;
import fs from "fs";

export default class MNHandler
{
    static saveMysql(data) : Promise<ErrnoException>
    {
        return new Promise(async resolve => {
            let string = JSON.stringify(data);
            let exists = await this.checkForFile("settings/database.MN");
            fs.writeFile("settings/database.MN", string, (err) => {
                resolve(err);
            });
        });
    }
    static isDatabaseSetup() : Promise<boolean>
    {
        return new Promise((resolve,reject) =>
        {
            fs.access("settings/database.MN",fs.constants.F_OK,(err)=>{
                if(err) resolve(false);
                resolve(true);
            });
        });
    }
    static getDatabaseInformation(path) : Promise<any>
    {
        return new Promise(resolve =>
        {
            fs.readFile(path,"utf8",(err,data)=>{
               resolve(JSON.parse(data));
            });
        });
    }
    static checkForFile(fileName)
    {
        return new Promise((resolve,reject) => {
            if (!fs.existsSync("settings")) {
                fs.mkdirSync("settings");
            }
            fs.access("settings", fs.constants.F_OK, (err) => {
                if (err) {
                    fs.mkdirSync("settings");
                }
                fs.access(fileName,fs.constants.F_OK,(err)=> {
                    if (!err) {
                        resolve(true);
                    } else {
                        fs.writeFile(fileName, "",  (data) => {
                            if(err) resolve(false);
                            resolve(true);
                        })
                    }
                });
            });
        });
    }
}