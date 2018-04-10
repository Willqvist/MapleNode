const MapleCharacterGenerator = require("./MapleCharacterGenerator/MCG");
const express = require("express");
const mysql = require("mysql");
let app = express();
app.listen(8081);
let mysqlCon = mysql.createConnection(
    {
        host:"localhost",
        user:"root",
        password:"",
        database:"zenthosdev"
    }
);
let mcg = new MapleCharacterGenerator(mysqlCon);
app.get("/",(req,res)=>
{
    mcg.generatePlayer("ZenthosDev",()=>{
        res.contentType('image/png');
        res.sendFile("MapleCharacterGenerator/newfile.png",{root:__dirname});
    });
});