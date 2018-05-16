const fs = require("fs");
const async = require("async");
const mysql = require("./mysql").getMysql();
const constants = require("./Constants");
class InstallationHandler
{
    constructor(mysql)
    {
    }
    installationComplete(callback)
    {
        fs.exists("settings/setup.MN",(exists)=>
        {
            let data =
            {
                done:false,
                mysqlSetupComplete:false,
            }
            if(exists)
            {
                fs.readFile("settings/setup.MN","utf8",(err, text)=>
                {
                    let data = JSON.parse(text);
                    callback(data.done,data);
                });
            }
            else
            {
                callback(data.done,data);
            }
        });
    }
    setMysqlSetupComplete(userData,callback)
    {
        async.waterfall(
        [
            //saving settings
            (callback)=>
            {
                this.getInstallerObject((data)=>
                {
                    data.mysqlSetupComplete = true;
                    data.prefix = userData.prefix; 
                    constants.setConstant("prefix",userData.prefix);
                    this.saveInstallerObject(data,(err,data)=>
                    {
                        callback(err,data);
                    });
                });
            },
            //creating prefix tables
            (data,callback)=>
            {
                mysql.connection.query(`DROP TABLE IF EXISTS ${userData.prefix}_Scheme`,(err,result)=>{
                    if(err) throw err;
                    mysql.connection.query(`CREATE TABLE ${userData.prefix}_Scheme
                    (
                    ID int NOT NULL AUTO_INCREMENT,
                    mainColor int(8),
                    secondaryColor int(8),
                    fontColorLight int(8),
                    fontColorDark int(8),
                    highlightColor int(8),
                    PRIMARY KEY(ID) 
                    )`,(err,result)=>
                    {
                        if(err) throw err;
                        callback(err,result);
                    });
                });
            },
            //creating prefix tables
            (data,callback)=>
            {
                mysql.connection.query(`DROP TABLE IF EXISTS ${userData.prefix}_Settings`,(err,result)=>{
                    if(err) throw err;
                    mysql.connection.query(`CREATE TABLE ${userData.prefix}_Settings
                    (
                        ID int NOT NULL AUTO_INCREMENT,
                        serverName varchar(255),
                        downloadLinks varchar(255),
                        version varchar(8),
                        expRate varchar(8),
                        dropRate varchar(8),
                        mesoRate varchar(8),
                        nxColumn varchar(8),
                        vpColumn varchar(8),
                        gmLevel int(1),
                        PRIMARY KEY(ID) 
                    )`,(err,result)=>
                    {
                        if(err) throw err;
                        callback(err,result);
                    });
                });
            },
            (data,callback)=>
            {
                mysql.connection.query(`DROP TABLE IF EXISTS ${userData.prefix}_Vote`,(err,result)=>{
                    if(err) throw err;
                    mysql.connection.query(`CREATE TABLE ${userData.prefix}_Vote
                    (
                        ID int NOT NULL AUTO_INCREMENT,
                        name varchar(255),
                        nx int(20),
                        time varchar(255),
                        url varchar(255),
                        PRIMARY KEY(ID)  
                    )`,(err,result)=>
                    {
                        if(err) throw err;
                        callback(err,result);
                    });
                });
            }           
        ],
        (err,result)=>
        {
            callback(err);
        }    
        );
    }
    setSetupComplete(userData,callback)
    {

        console.log("CREATE TABLE ",userData);
        userData.downloadLinks = userData.downloadSetup + ";" + userData.downloadClient;
       async.waterfall(
        [
            (callback)=>
            {
                mysql.connection.query(`
                INSERT INTO ${constants.getConstant("prefix")}_settings
                (serverName,downloadLinks,version,expRate,dropRate,mesoRate,nxColumn,vpColumn,gmLevel)
                VALUES(
                    '${userData.serverName}',
                    '${userData.downloadLinks};',
                    '${userData.version}',
                    '${userData.exp}',
                    '${userData.drop}',
                    '${userData.meso}',
                    '${userData.nx}',
                    '${userData.vp}',
                    '${userData.gmLevel}'
                )
                `,
                (err,result)=>
                {
                    if(err) throw err;
                    callback(err,result);
                });
            },
            (result,callback)=>
            {
                this.getInstallerObject((data)=>
                {
                    data.done=true; 
                    this.saveInstallerObject(data,(err,data)=>
                    {
                        callback(err,data);
                    });
                });
            }    
        ]
        ,(err,result)=>
        {
            callback(err);
        }    
        );
    }
    saveInstallerObject(data,callback)
    {
        fs.writeFile("settings/setup.MN",JSON.stringify(data),(err)=>
        {
            callback(err,data);
        });
    }
    getInstallerObject(callback)
    {
      this.installationComplete((done,data)=>
      {
        callback(data);   
      });  
    }
    getInstallErrors(error)
    {
        switch(error)
        {
            case "ECONNREFUSED":
                return "connection refused.. is mysql on?";
            break;
            case "ENOTFOUND":
                return "Could not connect to host";
            break;
            case "ER_ACCESS_DENIED_ERROR":
                return "Wrong username or password";
            break;
            case "ER_BAD_DB_ERROR":
                return "Could not find database";
            break;
            default:
                return "something went wrong... error code: " + error;
            break;
        }
    }
}
module.exports = InstallationHandler;