const fs = require("fs");
class MNHandler
{
    saveMysql(data)
    {
        return new Promise(resolve => {
            let string = JSON.stringify(data);
            this.checkForFile("settings/database.MN", () => {
                fs.writeFile("settings/database.MN", string, (err) => {
                    resolve(err);
                });
            });
        });
    }
    isDatabaseSetup() 
    {
        return new Promise((resolve,reject) =>
        {

            fs.exists("settings/database.MN",(data,err)=>{
                if(err) reject(err);
                resolve(data);
            });
        });
    }
    getMysql(path)
    {
        return new Promise(resolve =>
        {
            fs.readFile(path,"utf8",(err,data)=>{
               resolve(JSON.parse(data));
            });
        });
    }
    checkForFile(fileName,callback)
    {
        if (!fs.existsSync("settings")){
            fs.mkdirSync("settings");
        }
        fs.exists(fileName, function (exists) {
            if(exists)
            {
                callback();
            }else
            {
                fs.writeFile(fileName, {flag: 'wx'}, function (err, data) 
                { 
                    callback();
                })
            }
        });
    }
}
module.exports = new MNHandler();