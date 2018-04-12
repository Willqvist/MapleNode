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
        database:"xiuzsource"
    }
);
let mcg = new MapleCharacterGenerator(mysqlCon,60*5);
app.get("/Characters/*.chr",(req,res)=>
{
    let name = req.url.replace("/Characters/","").replace(".chr","");
    mcg.generatePlayer(name,(req)=>{
        if(!req.success)
        {
            console.log(req.reason);
        }
        res.contentType('image/png');
        res.sendFile("MapleCharacterGenerator/Characters/"+name+".png",{root:__dirname});
    });
});