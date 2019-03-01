const express = require("express");
const router = express.Router();
const constants = require("../Tools/Constants");
const library = require("../Tools/Library").getLibrary();
const fs = require("fs");
const parser = require("../wz_parser/parser");
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
const upload = multer();

router.all(["/","/index","/start"],(req,res,next)=>
{
    return res.render("library/index",{path:constants.getConstant("realPath"),error:false});
});


//SEARCH
router.get("/search",(req,res,next)=>
{
    return res.render("library/index",{path:constants.getConstant("realPath"),error:true,errorReason:"No search keyword given!"});
});

router.post("/search",(req,res)=>
{
    library.getAll(req.body.search,(data)=>
    {
        return res.send(JSON.stringify(data));
    });
});


//UPLOAD
router.get("/upload",(req,res)=>
{
    return res.render("library/upload");
});


//UPLOAD POST
let uploadSettings = 
{
    uploadedString:false
}
router.post("/upload/:uid",upload.array('wz'),(req,res)=>
{
    let wz_files = req.files;

    for(let id in wz_files)
    {
        let file = wz_files[id];

        if(file.originalname != "String.wz" && !uploadSettings.loadedString)
        {
            return res.send(JSON.stringify({error:"Upload String.wz first!",uid:req.params.uid}));
        }

        parser.add_to_parse({name:file.originalname,data:file.buffer},((result)=>
        {
            if(result.err.hasError)
                if(result.err.reason)
                    return res.send(JSON.stringify({error:result.err.reason,uid:req.params.uid}));
                else
                    return res.send(JSON.stringify({error:"Error parsing " + file.originalname,uid:req.params.uid}));
            
            uploadSettings.loadedString = true;
            return res.send(JSON.stringify({success:true,uid:req.params.uid}));
        }).bind(file));

        break;
    }
});


router.get("/:type/:id",(req,res)=>
{
    let id = req.params.id;
    let type = req.params.type;
    if(!constants.getConstant("type_mapper")[type]) return res.send("hmm");
    library.getData({id:id,type:type},(data)=>
    {
        return res.render("library/render-type/type-"+data.type,{data:data});
    });
});


router.get("/:id.:type.:ext",(req,res)=>
{
    let realPath = constants.getConstant("realPath");
    switch(req.params.ext)
    {
        case "img":
            let path = "/library/v62/"+constants.getConstant("type_mapper")[req.params.type]+"/"+req.params.id+"/icon.png";
            fs.exists(realPath + path,(err)=>
            {
                res.contentType('image/png');
                if(err)
                    return res.sendFile(path,{root:realPath});
                return res.sendFile("/library/undefined.png",{root:realPath});
            });
        break;
    }
});


router.get("/:id",(req,res)=>
{
    let id = req.params.id;

    if(id.length != 8 || isNaN(id)) return res.send("hmm");

    library.getData({id:id},(data)=>
    {
        return res.render("library/render-type/type-"+data.type,{data:data});
    });
});


module.exports = router;