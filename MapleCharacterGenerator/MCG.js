const ImageBuilder = require("./ImageBuilder");
const Canvas = require("./Canvas");
const mysql = require("mysql");
const FileLoader = require("./FileLoader");
const fs = require("fs");
const DOMParser = require('xmldom').DOMParser;
const util = require("util");
class MapleCharacterGenerator extends ImageBuilder
{
    constructor(mysql,cooldown){
        super();
        this.mysql = mysql;
        this.canvas = new Canvas(96,96);
        this.fileLoader = new FileLoader();
        this.offsetX = 44;
        this.offsetY = 33;
        this.parts ={};
        this.clothOffset = {x:0,y:10};
        this.headPosition = {x:-15,y:-11};
        this.faceOffset = {x:0,y:1};
        this.cooldown = cooldown;
        this.prefixes = 
        {
            hairShade:".0"
        };
        this.body = 
        {
            stand1:
            {
                parts:[
                    {
                        part:"body",
                        image:"stand1.0.body.png",
                        position:{x:7+this.headPosition.x,y:33+this.headPosition.y}
                    },
                    {
                        part:"head",
                        image:"front.head.png",
                        position:this.headPosition
                    },
                    {
                        type:"arm",
                        image:"stand1.0.arm.png",
                        position:{x:23+this.headPosition.x,y:35+this.headPosition.y}
                    },
                ]
            },
            stand2:
            {
                parts:[
                    {
                        part:"body",
                        image:"stand2.0.body.png",
                        position:{x:8+this.headPosition.x,y:33+this.headPosition.y}
                    },
                    {
                        part:"head",
                        image:"front.head.png",
                        position:this.headPosition
                    },
                    {
                        part:"arm",
                        image:"stand2.0.arm.png",
                        position:{x:19+this.headPosition.x,y:35+this.headPosition.y}
                    },
                    {
                        part:"hand",
                        image:"stand2.0.hand.png",
                        position:{x:5+this.headPosition.x,y:38+this.headPosition.y}
                    }
                ]
            }
        }
    }
    setHair(self,parameters,next)
    {
        let z = parameters.z;
        let id = parameters.id;
        if(typeof self.parts.cap !== "undefined" && z == "hairOverHead")
            return next();
        let file = new DOMParser().parseFromString(fs.readFileSync("MapleCharacterGenerator/items/Hair/000"+id+".img/coord.xml","utf8"),"text/xml");
        let hair = file.getElementsByTagName("_"+z);
        if(hair.length == 0)
            return next();
        
        hair = hair[0];
        let prefix = "";
        if(typeof self.prefixes[z] !== "undefined")
            prefix = self.prefixes[z];
        let x = hair.getElementsByTagName("x")[0].firstChild.data;
        let y = hair.getElementsByTagName("y")[0].firstChild.data;
        self.loadImage("MapleCharacterGenerator/items/Hair/000"+id+".img/default."+(z+prefix)+".png",(image)=>
        { 
            self.canvas.drawImage(image,self.offsetX + parseInt(x),self.offsetY + parseInt(y) + self.faceOffset.y);
            next();
        });
    }
    setFace(self,parameters,next)
    {
        let id = parameters.id;
        let file = new DOMParser().parseFromString(fs.readFileSync("MapleCharacterGenerator/items/Face/000"+id+".img/coord.xml","utf8"),"text/xml");
        let x = file.getElementsByTagName("x")[0].firstChild.data;
        let y = file.getElementsByTagName("y")[0].firstChild.data;
        self.loadImage("MapleCharacterGenerator/items/Face/000"+id+".img/default.face.png",(image)=>
        {
            self.canvas.drawImage(image,self.offsetX + parseInt(x)+self.faceOffset.x,self.offsetY + parseInt(y)+self.faceOffset.y);
            next();
        });
    }
    setBody(ids, pos,callback){
        this.loadBodyInformation(ids.skin, pos,(parts)=>
        {
            for(let i = 0; i < parts.length; i++){
                let part = parts[i];
                this.canvas.drawImage(part.image,this.offsetX + part.position.x, this.offsetY + part.position.y);
            }
            this.getFace(ids.face,()=>{});
            this.loadImage("MapleCharacterGenerator/items/Face/000"+ids.face+".img/default.face.png",(image)=>
            {
                callback();
            });
        });
    }
    setCap(self,parameters,next)
    {
        let id = parameters.id;
        let z = parameters.z;
        let file = new DOMParser().parseFromString(fs.readFileSync("MapleCharacterGenerator/items/Cap/0"+id+".img/coord.xml","utf8"),"text/xml");
        let zElem;
        let nodeName;
        let elements = file.getElementsByTagName("z");
        for(let i = 0; i < elements.length; i++)
        {
            console.log("CAP: ", elements[i].parentNode.nodeName.replace("_",""), elements[i].firstChild.data, z);
            if(elements[i].firstChild.data == z)
            {
                nodeName = elements[i].parentNode.parentNode.nodeName.replace("_","");
                zElem = elements[i].parentNode;
                break;
            }
        }
        if(zElem == null)
            return next();
        let x = zElem.getElementsByTagName("x")[0].firstChild.data;
        let y = zElem.getElementsByTagName("y")[0].firstChild.data;
        self.loadImage("MapleCharacterGenerator/items/Cap/0"+id+".img/default."+nodeName+".png",(image)=>
        {
            console.log("CAP DRAWN","MapleCharacterGenerator/items/Cap/0"+id+".img/default."+nodeName+".png");
            let position = self.body["stand"+self.parts.stand].parts[0].position;
            self.canvas.drawImage(image,self.offsetX + parseInt(x),self.offsetY + parseInt(y) + self.faceOffset.y);
            next();
        });
    }
    setMask(self,parameters,next)
    {

    }
    setEars(self,parameters,next)
    {
    }
    setAccessory(self,parameters,next)
    {
        let id = parameters.id;
        let z = parameters.z;
        let file = new DOMParser().parseFromString(fs.readFileSync("MapleCharacterGenerator/items/Accessory/0"+id+".img/coord.xml","utf8"),"text/xml");
        let zElem;
        let elements = file.getElementsByTagName("z"); 
        let nodeName;
        for(let i = 0; i < elements.length; i++)
        {
            if(elements[i].firstChild.data == z)
            {
                nodeName = elements[i].parentNode.parentNode.nodeName.replace("_","");
                zElem = elements[i].parentNode;
                break;
            }
        }
        if(zElem == null)
            return next();

        let x = zElem.getElementsByTagName("x")[0].firstChild.data;
        let y = zElem.getElementsByTagName("y")[0].firstChild.data;
        self.loadImage("MapleCharacterGenerator/items/Accessory/0"+id+".img/default.default.png",(image)=>
        {

            self.canvas.drawImage(image,self.faceOffset.x + self.offsetX + parseInt(x),self.faceOffset.y + self.offsetY + parseInt(y));
            next();
        });       
    }
    setUpperBodyCloth(self,parameters,next,type)
    {
        let id = parameters.id;
        let z = parameters.z;
        let file = new DOMParser().parseFromString(fs.readFileSync("MapleCharacterGenerator/items/"+type+"/0"+id+".img/coord.xml","utf8"),"text/xml");
        let elements = file.getElementsByTagName("z");
        let zElem;
        let nodeName;
        for(let i = 0; i < elements.length; i++)
        {
            if(elements[i].parentNode.nodeName == "stand"+self.parts.stand && elements[i].firstChild.data == z)
            {
                nodeName = elements[i].parentNode.parentNode.nodeName.replace("_","");
                console.log("PARENT NODE NAME, ",elements[i].parentNode.nodeName);
                zElem = elements[i].parentNode;
                break;
            }
        }
        if(zElem == null)
            return next();
        let x = zElem.getElementsByTagName("x")[0].firstChild.data;
        let y = zElem.getElementsByTagName("y")[0].firstChild.data;
        self.loadImage("MapleCharacterGenerator/items/"+type+"/0"+id+".img/stand"+self.parts.stand+".0."+nodeName+".png",(image)=>
        {
            console.log("caoted");
            let position = self.body["stand"+self.parts.stand].parts[0].position;
            self.canvas.drawImage(image,self.clothOffset.x + self.offsetX + parseInt(x),self.clothOffset.y + position.y + self.offsetY + parseInt(y));
            next();
        });
    }
    setCoat(self,parameters,next)
    { 
        if(!fs.existsSync("MapleCharacterGenerator/items/Coat/0"+parameters.id+".img/coord.xml"))
            return next();
        self.setUpperBodyCloth(self,parameters,next,"Coat");
    }
    setLongCoat(self,parameters,next)
    {
        if(!fs.existsSync("MapleCharacterGenerator/items/LongCoat/0"+parameters.id+".img/coord.xml"))
            return next();
        self.setUpperBodyCloth(self,parameters,next,"LongCoat");
    }
    setPants(self,parameters,next)
    {
        let id = parameters.id;
        let z = parameters.z;
        let file = new DOMParser().parseFromString(fs.readFileSync("MapleCharacterGenerator/items/Pants/0"+id+".img/coord.xml","utf8"),"text/xml");
        let elements = file.getElementsByTagName("z");
        let zElem;
        for(let i = 0; i < elements.length; i++)
        {
            if(elements[i].parentNode.nodeName.includes("stand"+self.parts.stand) && elements[i].firstChild.data == z)
            {
                zElem = elements[i].parentNode;
                break;
            }
        }
        if(zElem == null)
           return next();
        let x = zElem.getElementsByTagName("x")[0].firstChild.data;
        let y = zElem.getElementsByTagName("y")[0].firstChild.data;
        let stand = 1;
        self.loadImage("MapleCharacterGenerator/items/Pants/0"+id+".img/stand"+stand+".0.pants.png",(image)=>
        {
            console.log("panted");
            let position = self.body["stand"+self.parts.stand].parts[0].position;
            self.canvas.drawImage(image,self.clothOffset.x + self.offsetX + parseInt(x),self.clothOffset.y + position.y + self.offsetY + parseInt(y));
            next();
        }); 
    }
    setShoes(self,parameters,next)
    {
        let id = parameters.id;
        let z = parameters.z;
        let file = new DOMParser().parseFromString(fs.readFileSync("MapleCharacterGenerator/items/Shoes/0"+id+".img/coord.xml","utf8"),"text/xml");
        let elements = file.getElementsByTagName("z");
        let zElem;
        for(let i = 0; i < elements.length; i++)
        {
            if(elements[i].parentNode.nodeName.includes("stand1") && elements[i].firstChild.data == z)
            {
                zElem = elements[i].parentNode;
                break;
            }
        }
        let x = zElem.getElementsByTagName("x")[0].firstChild.data;
        let y = zElem.getElementsByTagName("y")[0].firstChild.data;
        self.loadImage("MapleCharacterGenerator/items/Shoes/0"+id+".img/stand1.0.shoes.png",(image)=>
        {
            let position = self.body["stand"+self.parts.stand].parts[0].position;
            self.canvas.drawImage(image,self.clothOffset.x + self.offsetX + parseInt(x),self.clothOffset.y + position.y + self.offsetY + parseInt(y));
            next();
        });
    }
    setGloves(self,parameters,next)
    {
        let id = parameters.id;
        let z = parameters.z;
        let file = new DOMParser().parseFromString(fs.readFileSync("MapleCharacterGenerator/items/Glove/0"+id+".img/coord.xml","utf8"),"text/xml");
        let elements = file.getElementsByTagName("z");
        let zElem = [];
        let positions = [];
        let nodeName;
        for(let i = 0; i < elements.length; i++)
        {
            if(elements[i].parentNode.nodeName.replace("_","") == "stand"+self.parts.stand && elements[i].firstChild.data == z)
            {
                nodeName = elements[i].parentNode.parentNode.nodeName.replace("_","");
                zElem.push(elements[i].parentNode);
                positions.push(
                    {
                        x:elements[i].parentNode.getElementsByTagName("x")[0].firstChild.data,
                        y:elements[i].parentNode.getElementsByTagName("y")[0].firstChild.data
                    }
                )
            }
        }
        if(zElem.length == 0)
            return next();
        self.loadImage("MapleCharacterGenerator/items/Glove/0"+id+".img/stand"+self.parts.stand+".0."+nodeName+".png",(image)=>
        {
            let position = self.body["stand"+self.parts.stand].parts[0].position;
            for(let i = 0; i < positions.length;i++)
            {
                self.canvas.drawImage(image,self.clothOffset.x + self.offsetX + parseInt(positions[i].x),self.clothOffset.y + position.y + self.offsetY + parseInt(positions[i].y));
            }
            next();
        }); 
    }
    setCape(self,parameters,next)
    {
        let id = parameters.id;
        let z = parameters.z;
        let file = new DOMParser().parseFromString(fs.readFileSync("MapleCharacterGenerator/items/Cape/0"+id+".img/coord.xml","utf8"),"text/xml");
        let elements = file.getElementsByTagName("z");
        let zElem;
        for(let i = 0; i < elements.length; i++)
        {
            if(elements[i].parentNode.nodeName.includes("stand1") && elements[i].firstChild.data == z)
            {
                zElem = elements[i].parentNode;
                break;
            }
        }
        if(zElem == null)
        {
            return next();
        }
        let x = zElem.getElementsByTagName("x")[0].firstChild.data;
        let y = zElem.getElementsByTagName("y")[0].firstChild.data;
        self.loadImage("MapleCharacterGenerator/items/Cape/0"+id+".img/stand1.0.cape.png",(image)=>
        {
            let position = self.body["stand"+self.parts.stand].parts[0].position;
            self.canvas.drawImage(image,self.clothOffset.x + self.offsetX + parseInt(x),self.clothOffset.y + position.y + self.offsetY + parseInt(y));
            next();
        });        
    }  
    setShield(self,parameters,next)
    {
        if(self.parts.stand != 1)
            return next();
        let id = parameters.id;
        let file = new DOMParser().parseFromString(fs.readFileSync("MapleCharacterGenerator/items/Shield/0"+id+".img/coord.xml","utf8"),"text/xml");
        let x = file.getElementsByTagName("x")[0].firstChild.data;
        let y = file.getElementsByTagName("y")[0].firstChild.data;
        self.loadImage("MapleCharacterGenerator/items/Shield/0"+id+".img/stand1.0.shield.png",(image)=>
        {
            let position = self.body["stand"+self.parts.stand].parts[0].position;
            self.canvas.drawImage(image,self.clothOffset.x + self.offsetX + parseInt(x),self.clothOffset.y + position.y + self.offsetY + parseInt(y));
            next();
        });
    }
    setWeapon(self,parameters,next)
    {
        let id = parameters.id; 
        let z = parameters.z;
        let file = new DOMParser().parseFromString(fs.readFileSync("MapleCharacterGenerator/items/Weapon/0"+id+".img/coord.xml","utf8"),"text/xml");
        let prefix = "";
        let zElem;
        let elements = file.getElementsByTagName("z");
        let nodeName;
        for(let i = 0; i < elements.length; i++)
        {
            if(elements[i].parentNode.nodeName.includes("stand" + self.parts.stand) && elements[i].firstChild.data == z)
            {
                nodeName = elements[i].parentNode.nodeName;
                zElem = elements[i].parentNode;
                break;
            }
        }
        if(zElem == null)
            return next();
        let infoStand = file.getElementsByTagName("_info")[0].getElementsByTagName(nodeName.replace("_",""))[0];
        let x = zElem.getElementsByTagName("x")[0].firstChild.data;
        let y = zElem.getElementsByTagName("y")[0].firstChild.data;
        console.log("WEAPON POSITION", x,y);
        if(infoStand != null)
        {
            let child;
            if((child = infoStand.getElementsByTagName("NUM")[0]) != null)
            {
                prefix = child.firstChild.data + ".";
            }
        }
        self.loadImage("MapleCharacterGenerator/items/Weapon/0"+id+".img/"+prefix+"stand"+self.parts.stand+".0.weapon.png",(image)=>
        {
            let position = self.body["stand"+self.parts.stand].parts[0].position;
            self.canvas.drawImage(image,self.clothOffset.x + self.offsetX + parseInt(x),self.clothOffset.y + position.y + self.offsetY + parseInt(y));
            next();
        });
    }
    getZElement(dom,z)
    {
        let zObj = dom.getElementsByTagName("z");
        for(let i= 0; i < zObj.length; i++)
        {
            if(zObj[i].firstChild.data == z)
            {
                return zObj[i];
            }
        }
        return -1;
    }
    setTorso(self,parameters,next)
    {
        let id = parameters.id;
        self.loadImage("MapleCharacterGenerator/items/Skin/0000"+id+".img/stand"+self.parts.stand+".0.body.png",(image)=>
        {
            let position = self.body["stand"+self.parts.stand].parts[0].position;
            self.canvas.drawImage(image,self.offsetX + position.x,self.offsetY + position.y);
            next();
        });
    }
    setHead(self,parameters,next)
    {
        let id = parameters.id;
        self.loadImage("MapleCharacterGenerator/items/Skin/0000"+id+".img/front.head.png",(image)=>
        {
            let position = self.body["stand"+self.parts.stand].parts[1].position;
            self.canvas.drawImage(image,self.offsetX + position.x,self.offsetY + position.y);
            next();
        });
    }
    setHands(self,parameters,next)
    {
        let id = parameters.id;
        let file = "MapleCharacterGenerator/items/Skin/0000"+id+".img/stand"+self.parts.stand+".0.hand.png";
        if(!fs.existsSync(file))
            return next();
        self.loadImage(file,(image)=>
        {
            let position = self.body["stand"+self.parts.stand].parts[3].position;
            self.canvas.drawImage(image,self.offsetX + position.x,self.offsetY + position.y);
            next();
        });
    }
    setArm(self,parameters,next)
    {
        let id = parameters.id;
        self.loadImage("MapleCharacterGenerator/items/Skin/0000"+id+".img/stand"+self.parts.stand+".0.arm.png",(image)=>
        {
            let position = self.body["stand"+self.parts.stand].parts[2].position;
            self.canvas.drawImage(image,self.offsetX + position.x,self.offsetY + position.y);
            next();
        });  
    }
    equipItems(items,callback,index=0)
    {
        console.log("at index:",index);
        let self = this;
        if(typeof items[index].parameters.id === "undefined")
        {
            this.equipItems(items,callback,++index);
            return;
        }
        items[index].method(self,items[index].parameters,()=>
        {
            if(index >= items.length - 1){
                callback();
                return;
            }
            this.equipItems(items,callback,++index);
        });
    }    
    setWeaponInfo(id)
    {
        let file = new DOMParser().parseFromString(fs.readFileSync("MapleCharacterGenerator/items/Weapon/0"+id+".img/coord.xml","utf8"),"text/xml");
        let info = file.getElementsByTagName("_info")[0].getElementsByTagName("stand")[0].getElementsByTagName("value")[0].firstChild.data;
        this.parts.stand = parseInt(info);
    }
    generatePlayer(name,callback)
    {
        this.mysql.query("SELECT id, face, hair,skincolor FROM characters WHERE name=?",[name],(err,results)=>
        {
            if(err) throw err;
            if(fs.existsSync(__dirname + "/Characters/"+name+".png"))
            {
                let stat = fs.statSync(__dirname + "/Characters/"+name+".png");
                let date = new Date(util.inspect(stat.mtime));
                let dateNow = new Date();
                console.log((dateNow-date)/1000, this.cooldown);
                if((dateNow-date)/1000 < this.cooldown)
                    return callback({success:true});
            }
            if(results.length == 0)
                return callback({success:false,reason:"cant find player: " + name});
            this.canvas.fillColor = 0xFFFFFF;
            this.canvas.drawRect(0,0,180,180);
            this.parts.face = results[0].face;
            this.parts.hair = results[0].hair;
            this.parts.skincolor = results[0].skincolor;
            this.mysql.query("SELECT inventoryitems.itemid, inventoryitems.position FROM inventoryequipment INNER JOIN inventoryitems ON inventoryequipment.inventoryitemid = inventoryitems.inventoryitemid WHERE inventoryitems.characterid = ? AND inventoryitems.inventorytype = '-1'",[results[0].id],(err,results)=>
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
                                this.setWeaponInfo(this.parts.weapon);
                            else
                                this.parts.stand = 1;
                        }break;
                    }
                }
                console.log(this.parts);
                this.equipItems(
                    [
                        {method:this.setCape,parameters:{id:this.parts.cape,z:"capeBelowBody"}},
                        {method:this.setShield,parameters:{id:this.parts.shield,z:"shield"}},
                        {method:this.setCap,parameters:{id:this.parts.cap,z:"capAccessoryBelowBody"}},
                        {method:this.setTorso,parameters:{id:this.parts.skincolor+2000,z:"skincolor"}},
                        {method:this.setCoat,parameters:{id:this.parts.coat,z:"mailChestBelowPants"}},
                        {method:this.setPants,parameters:{id:this.parts.pants,z:"pants"}},                        
                        {method:this.setCoat,parameters:{id:this.parts.coat,z:"mailChest"}},
                        {method:this.setPants,parameters:{id:this.parts.pants,z:"pantsBelowShoes"}},
                        {method:this.setShoes,parameters:{id:this.parts.shoes,z:"shoes"}},
                        {method:this.setLongCoat,parameters:{id:this.parts.coat,z:"mailChestOverHighest"}},
                        {method:this.setHead,parameters:{id:this.parts.skincolor+2000,z:"skincolor"}},
                        {method:this.setAccessory,parameters:{id:this.parts.ears,z:"accessoryEar"}},
                        {method:this.setAccessory,parameters:{id:this.parts.mask,z:"accessoryFaceBelowFace"}},
                        {method:this.setFace,parameters:{id:this.parts.face,z:"face"}},
                        {method:this.setAccessory,parameters:{id:this.parts.mask,z:"accessoryFace"}},
                        {method:this.setAccessory,parameters:{id:this.parts.eyes,z:"accessoryEye"}},
                        {method:this.setHair,parameters:{id:this.parts.hair,z:"hairShade"}},
                        {method:this.setHair,parameters:{id:this.parts.hair,z:"hair"}},
                        {method:this.setHair,parameters:{id:this.parts.hair,z:"hairOverHead"}},
                        {method:this.setCap,parameters:{id:this.parts.cap,z:"cap"}},
                        {method:this.setGloves,parameters:{id:this.parts.glove,z:"gloveOverBody"}},
                        {method:this.setWeapon,parameters:{id:this.parts.weapon,z:"weapon"}},
                        {method:this.setArm,parameters:{id:this.parts.skincolor+2000}},
                        {method:this.setCoat,parameters:{id:this.parts.coat,z:"mailArm"}},
                        {method:this.setLongCoat,parameters:{id:this.parts.coat,z:"mailArm"}},
                        {method:this.setWeapon,parameters:{id:this.parts.weapon,z:"weaponOverArm"}},
                        {method:this.setHands,parameters:{id:this.parts.skincolor+2000}},
                        {method:this.setGloves,parameters:{id:this.parts.glove,z:"glove"}},
                        {method:this.setGloves,parameters:{id:this.parts.glove,z:"gloveOverHair"}},
                    ],
                    ()=>
                    {
                        this.outputImage(this.canvas,__dirname + "/Characters/"+name+".png",()=>
                        {
                            callback({success:true});
                        });
                    }
                );
            });
        });
    }

}
module.exports = MapleCharacterGenerator; 