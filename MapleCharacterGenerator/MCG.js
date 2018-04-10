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
        this.offsetX = 44;
        this.offsetY = 23;
        this.parts ={};

        this.headPosition = {x:-14,y:-11};
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
                        position:{x:22+this.headPosition.x,y:34+this.headPosition.y}
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
                        position:{x:20+this.headPosition.x,y:35+this.headPosition.y}
                    },
                    {
                        part:"hand",
                        image:"stand2.0.hand.png",
                        position:{x:6+this.headPosition.x,y:37+this.headPosition.y}
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
    setHair(id,z,callback)
    {
        let file = new DOMParser().parseFromString(fs.readFileSync("MapleCharacterGenerator/items/Hair/000"+id+".img/coord.xml","utf8"),"text/xml");
        let hair = file.getElementsByTagName("_"+z)[0];
        let prefix = "";
        if(typeof this.prefixes[z] !== "undefined")
            prefix = this.prefixes[z];

        if(hair == null) return;
        let x = hair.getElementsByTagName("x")[0].firstChild.data;
        let y = hair.getElementsByTagName("y")[0].firstChild.data;
        this.loadImage("MapleCharacterGenerator/items/Hair/000"+id+".img/default."+(z+prefix)+".png",(image)=>
        {
            this.canvas.drawImage(image,this.offsetX + parseInt(x),this.offsetY + parseInt(y));
            console.log(this.offsetX + parseInt(x) + 4,this.offsetY + parseInt(y));
            callback();
        });
    }
    setFace(self,parameters,next)
    {
        let id = parameters.id;
        console.log("this: " , parameters);
        let file = new DOMParser().parseFromString(fs.readFileSync("MapleCharacterGenerator/items/Face/000"+id+".img/coord.xml","utf8"),"text/xml");
        let x = file.getElementsByTagName("x")[0].firstChild.data;
        let y = file.getElementsByTagName("y")[0].firstChild.data;
        self.loadImage("MapleCharacterGenerator/items/Face/000"+id+".img/default.face.png",(image)=>
        {
            self.canvas.drawImage(image,self.offsetX + parseInt(x),self.offsetY + parseInt(y));
            console.log(self.offsetX + parseInt(x) + 4,self.offsetY + parseInt(y));
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
    setCap(self,id,z,callback)
    {

    }
    setMask(self,id,z,callback)
    {

    }
    setEars(id,z,callback)
    {

    }
    setCoat(self,id,z,callback)
    {

    }
    setPants(self,id,z,callback)
    {

    }
    setShoes(self,id,z,callback)
    {

    }
    setGloves(self,id,z,callback)
    {

    }
    setCape(self,id,z,callback)
    {

    }  
    setShield(self,id,z,callback)
    {

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
    setHands()
    {

    }
    equipItems(items,callback,index=0)
    {
        let self = this;
        items[index].method(self,items[index].parameters,()=>
        {
            console.log("index: " + index);
            if(index >= items.length - 1){
                callback();
                return;
            }
            this.equipItems(items,callback,index+1);
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
                console.log(this.parts);
                this.equipItems(
                    [
                        {method:this.setTorso,parameters:{id:this.parts.skincolor+2000}},
                        {method:this.setFace,parameters:{id:this.parts.face}}
                    ],
                    ()=>
                    {
                        this.outputImage(this.canvas,__dirname + "/newfile.png",()=>
                        {
                            callback();
                        });
                    }
                );
                /*
                this.setBody({skin:this.parts.skincolor+2000, face: this.parts.face}, this.body["stand" + this.parts.stand],()=>
                {
                    this.setFace(this.parts.face,()=>
                    {
                        this.setHair(this.parts.hair,"hairShade",()=>
                        {
                            this.setHair(this.parts.hair,"hair",()=>
                            {
                                this.setHair(this.parts.hair,"hairOverHead",()=>
                                {
                                });
                            });
                        });
                    });
                });
                */
            });
        });
    }

}
module.exports = MapleCharacterGenerator; 