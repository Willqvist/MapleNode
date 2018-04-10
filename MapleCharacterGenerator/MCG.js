const ImageBuilder = require("./ImageBuilder");
const Canvas = require("./Canvas");
const mysql = require("mysql");
const FileLoader = require("./FileLoader");
const fs = require("fs");
const DOMParser = require('xmldom').DOMParser;
class MapleCharacterGenerator extends ImageBuilder
{
    constructor(mysql){
        super();
        this.mysql = mysql;
        this.canvas = new Canvas(96,96);
        this.fileLoader = new FileLoader();
        this.offsetX = 28;
        this.offsetY = 15;
        this.parts ={};
        this.body = 
        {
            stand1:
            {
                parts:[
                    {
                        part:"body",
                        image:"stand1.0.body.png",
                        position:{x:7,y:33}
                    },
                    {
                        part:"head",
                        image:"front.head.png",
                        position:{x:0,y:0}
                    },
                    {
                        type:"arm",
                        image:"stand1.0.arm.png",
                        position:{x:22,y:34}
                    },
                ]
            },
            stand2:
            {
                parts:[
                    {
                        part:"body",
                        image:"stand2.0.body.png",
                        position:{x:7,y:33}
                    },
                    {
                        part:"head",
                        image:"front.head.png",
                        position:{x:0,y:0}
                    },
                    {
                        part:"arm",
                        image:"stand2.0.arm.png",
                        position:{x:19,y:35}
                    },
                    {
                        part:"hand",
                        image:"stand2.0.hand.png",
                        position:{x:4,y:37}
                    }
                ]
            }
        }
    }
    loadBodyInformation(skinID,pos,callback)
    {
        this.loadMultibleImages(pos.parts.map(a=>"MapleCharacterGenerator/items/Skin/0000"+skinID+".img/" + a.image),(images)=>
        {
            let bodyArr = pos.parts;
            let arr = [];
            for(let i = 0; i < images.length; i++)
            {
                arr.push(
                    {
                        image:images[i],
                        position:bodyArr[i].position
                    }
                );
            }
            callback(arr);
        }); 
    }
    loadPartInformation(file,callback)
    {
        this.loadImage(file.path+file.file,(image)=>
        {
            let fileInfo = this.fileLoader.parseXML(file.path+"coord.xml");
            callback(image,fileInfo);
        });
    }
    /*
    loadItem(directory,callback)
    {
        let file = this.fileLoader.parseXML(directory + "/coord.xml");
        let files = [];
        for(let i = 0; i < file.root.children.length; i++){
            let child = file.root.children[i];
            if(file.root.children[i].name == "_info") continue;
            for(let j = 0; j < child.children.length; j++){
                let subChild = child;
                let subname = "default";
                let subsubname = "";
                let middleName = child.name.replace("_","");                
                if(child.children[j].name.includes("stand"))
                {
                    let name = child.children[j].name.replace("_","");
                    //console.log(file.root.children[child.children.length]);
                    if(file.root.children[child.children.length].name == "_info")
                        for(let k = 0; k < file.root.children[child.children.length].children.length; k++)
                        {
                            if(file.root.children[child.children.length].children[k].name.replace("_","") == name)
                            {
                                console.log("INCLUDED:");
                                subsubname = file.root.children[child.children.length].children[k].children[0].content + ".";
                                break;
                            }  
                        }
                    subname = subsubname +""+ name+".0";
                    //console.log(subname);
                    subChild = child.children[j];
                }
                let fileName = subname + "." + middleName + ".png";
                if(!fs.existsSync(directory + "/" + fileName))
                {
                    subname.replace(subsubname,"");
                    fileName = subname + "." + middleName + ".png";
                    if(!fs.existsSync(directory + "/" + fileName)){
                        subname = "default";
                        fileName = subname + "." + middleName + ".png"
                        if(!fs.existsSync(directory + "/" + fileName)){
                            continue;
                        }
                    }
                }
                let position = {x:subChild.children[0].content,y:subChild.children[1].content};
                files.push(
                    {
                        directory:directory,
                        filename:fileName,
                        position:position
                    }
                );
                console.log(fileName,position);
            }
        }
        console.log(files.map(a=> a.directory + "/" + a.filename));
        this.loadMultibleImages(files.map(a=> a.directory + "/" + a.filename),((images)=>
        {
            for(let i = 0; i < files.length; i++)
            {
              files[i].image = images[i];
            }
            callback(files);
        }).bind(files));
    }
    */
    getHat(id,callback){

    }
    getBody(id,callback){}
    getWeapon(id,callback){}
    getFace(id,callback)
    {
        //let file = this.fileLoader.parseXML("MapleCharacterGenerator/items/Coat/01040000.img/coord.xml");
        /*
        this.loadItem("MapleCharacterGenerator/items/Accessory/01010001.img",(items)=>
        {
            console.log(items);
            for(let i = 0; i < items.length; i++){
                let item = items[i];
                console.log((12 + item.position.x),item.position.y);
                this.canvas.drawImage(item.image,12 + parseInt(item.position.x),parseInt(item.position.y));
            }
        });
        */
    }
    setEyes(id)
    {
        let file = new DOMParser().parseFromString(this.fs.readFileSync("MapleCharacterGenerator/items/Coat/000"+id+".img/coord.xml"));
        let position = file;
        position.x = file.root.children[0]
    }
    setBody(ids, pos,callback){
        this.loadBodyInformation(ids.skin, pos,(parts)=>
        {
            for(let i = 0; i < parts.length; i++){
                let part = parts[i];
                this.canvas.drawImage(part.image,this.offsetX + part.position.x, this.offsetY + part.position.y);
            }
            this.getFace(ids.face,()=>{});
            this.loadPartInformation({path:"MapleCharacterGenerator/items/Face/000"+ids.face+".img/",file:"default.face.png"},(image)=>
            {
                callback();
            });
        });
    }
    generatePlayer(name,callback)
    {
        this.mysql.query("SELECT id, face, hair,skincolor FROM characters WHERE name=?",[name],(err,results)=>
        {
            if(err) throw err;
            this.canvas.fillColor = 0xFFFFFF;
            this.canvas.drawRect(0,0,180,180);
            this.parts.face = results[0].face;
            this.parts.hair = results[0].hair;
            this.parts.skincolor = results[0].skincolor;
            this.mysql.query("SELECT inventoryitems.itemid, inventoryitems.position FROM inventoryequipment INNER JOIN inventoryitems ON inventoryequipment.inventoryitemid = inventoryitems.inventoryitemid WHERE inventoryitems.characterid = ?",[results[0].id],(err,results)=>
            {         
                if(err) throw err;
                for(let i = 0; i < results.length; i++)
                {
                    switch(results[i].position) {
                        case -1: case -101:this.parts.cap    = results[i].itemid;break;
                        case -2: case -102:this.parts.mask   = results[i].itemid;break;
                        case -3: case -103:this.parts.eyes   = results[i].itemid;break;
                        case -4: case -104:this.parts.ears   = results[i].itemid;break;
                        case -5: case -105:this.parts.coat   = results[i].itemid;break;
                        case -6: case -106:this.parts.pants  = results[i].itemid;break;
                        case -7: case -107:this.parts.shoes  = results[i].itemid;break;
                        case -8: case -108:this.parts.glove  = results[i].itemid;break;
                        case -9: case -109:this.parts.cape   = results[i].itemid;break;
                        case -10:case -110:this.parts.shield = results[i].itemid;break;
                        case -11:case -111:
                        {
                            this.parts.weapon = results[i].itemid;
                            if(this.parts.weapon < 1700000)
                                this.parts.stand = 2;
                            else
                                this.parts.stand = 1;
                        }break;
                    }
                }
                this.setBody({skin:this.parts.skincolor+2000, face: this.parts.face}, this.body["stand" + this.parts.stand],()=>
                {
                    this.setEyes(this.parts.eyes);
                    this.outputImage(this.canvas,__dirname + "/newfile.png",()=>
                    {
                        callback();
                    });
                });
            });
        });
    }

}
module.exports = MapleCharacterGenerator; 