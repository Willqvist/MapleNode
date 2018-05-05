const express = require("express");
const router = express.Router();
const MapleCharacterGenerator = require("../MapleCharacterGenerator/MCG");
const mysql = require("../Tools/mysql").getMysql();
const InstallHandler = require("../Tools/InstallationHandler");
const constants = require("../Tools/Constants");
const Rules = require("../Tools/Rules");
let mcg = new MapleCharacterGenerator(mysql.connection,60*5);
let installHandler = new InstallHandler(mysql.mysql);
router.post("/login",(req,res)=>
{
    setTimeout(()=>{
        mysql.connection.query(`SELECT * FROM accounts WHERE name = ? AND password = ?`,[req.body.username,req.body.password],(err, result, fields)=>
        {
            let data = {};
            data.success = true;
            data.loggedin = false;
            data.reason = "Wrong username or password";
            if(result.length >= 1)
            {
                data.loggedin = true;
                data.reason = "You have successfully loggedin!";
            }
            res.send(JSON.stringify(data)); 
        });
    },2000);
});
module.exports = router;