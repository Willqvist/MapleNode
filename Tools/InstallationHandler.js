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
            //creating prefix tables
            (data,callback)=>
            {
                mysql.connection.query(`DROP TABLE IF EXISTS ${userData.prefix}_Settings`,(err,result)=>{
                    if(err) throw err;
                    mysql.connection.query(`CREATE TABLE ${userData.prefix}_Settings
                    (
                        ID int NOT NULL AUTO_INCREMENT,
                        serverName varchar(255),
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
                        ID int NOT NULL,
                        name varchar(255),
                        nx int(20),
                        time varchar(255),
                        url varchar(255),
                        PRIMARY KEY(name)  
                    )`,(err,result)=>
                    {
                        console.log("eww");
                        if(err) throw err;
                        callback(err,result);
                    });
                });
            },
            (data,callback)=>
            {
                mysql.connection.query(`DROP TABLE IF EXISTS ${userData.prefix}_palettes`,(err,result)=>{
                    if(err) throw err;
                    mysql.connection.query(`CREATE TABLE ${userData.prefix}_palettes
                    (
                        name varchar(255),
                        mainColor varchar(20),
                        secondaryMainColor varchar(20),
                        fontColorLight varchar(20),
                        fontColorDark varchar(20),
                        fillColor varchar(20),
                        active int(1),
                        PRIMARY KEY(name)  
                    )`,(err,result)=>
                    {
                        if(err) throw err;
                        mysql.connection.query(`INSERT INTO ${userData.prefix}_palettes (name, mainColor,secondaryMainColor, fontColorLight, fontColorDark, fillColor,active) VALUES('Happy Green','#69DC9E','#3E78B2','#D3F3EE','#20063B','#CC3363','1')`,(err,result)=>
                        {
                            if(err) throw err;

                            constants.setConstant("palette",
                            {
                                name:'Happy Green',
                                name:'#69DC9E',
                                mainColor:'#69DC9E',
                                secondaryMainColor:'#3E78B2',
                                fontColorLight:'#D3F3EE', 
                                ontColorDark:'#20063B',
                                fillColor:'#CC3363'
                            });
                            callback(err,result);
                        });
                    });
                });
            },
            (data,callback)=>
            {
                mysql.connection.query(`DROP TABLE IF EXISTS ${userData.prefix}_design`,(err,result)=>{
                    if(err) throw err;
                    mysql.connection.query(`CREATE TABLE ${userData.prefix}_design
                    (
                        ID int NOT NULL AUTO_INCREMENT,
                        heroImage varchar(80),
                        PRIMARY KEY(id)
                    )`,(err,result)=>
                    {
                        if(err) throw err;
                        mysql.connection.query(`INSERT INTO ${userData.prefix}_design (heroImage) VALUES('headerImage.png')`,(err,result)=>
                        {
                            if(err) throw err;
                            callback(err,result);
                        });
                    });
                });
            },
            (data,callback)=>
            {
                mysql.connection.query(`DROP TABLE IF EXISTS ${userData.prefix}_downloads`,(err,result)=>{
                    if(err) throw err;
                    mysql.connection.query(`CREATE TABLE ${userData.prefix}_downloads
                    (
                        ID int NOT NULL AUTO_INCREMENT,
                        name varchar(80),
                        url varchar(80),
                        PRIMARY KEY(id)
                    )`,(err,result)=>
                    {
                        if(err) throw err;
                        callback(err,result);
                    });
                });
            }
            /*
            ,
            (data,callback)=>
            {
                mysql.connection.query(`DROP TABLE IF EXISTS ${userData.prefix}_library_${userData.}`,(err,result)=>{
                    if(err) throw err;
                    mysql.connection.query(`CREATE TABLE ${userData.prefix}_downloads
                    (
                        ID int NOT NULL AUTO_INCREMENT,
                        name varchar(80),
                        url varchar(80),
                        PRIMARY KEY(id)
                    )`,(err,result)=>
                    {
                        if(err) throw err;
                        callback(err,result);
                    });
                });
            }     
            */           
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
        //userData.downloadLinks = userData.downloadSetup + ";" + userData.downloadClient;
       async.waterfall(
        [
            (callback)=>
            {
                mysql.connection.query(`
                INSERT INTO ${constants.getConstant("prefix")}_settings
                (serverName,version,expRate,dropRate,mesoRate,nxColumn,vpColumn,gmLevel)
                VALUES(
                    '${userData.serverName}',
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
            (data,callback)=>
            {
                mysql.connection.query(`INSERT INTO ${constants.getConstant("prefix")}_downloads (name,url) VALUES( 'Setup', '${userData.downloadSetup}')`,(err,result)=>
                {
                    if(err) throw err;
                    mysql.connection.query(`INSERT INTO ${constants.getConstant("prefix")}_downloads (name,url) VALUES( 'Client', '${userData.downloadClient}')`,(err,result)=>
                    {
                        if(err) throw err;
                        callback(err,result);
                    });
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