const Canvas = require("./Canvas");
const fs = require("fs");
const DOMParser = require('xmldom').DOMParser;
const ImageBuilder = require("./ImageBuilder");
class ItemBuilder extends ImageBuilder
{
    // 145200-1452155 OFFSET
    //
    constructor(){
        super();
        this.canvas = new Canvas(96,96);
        this.offsetX = 44;
        this.offsetY = 33;
        this.parts ={};
        this.clothOffset = {x:0,y:10};
        this.headPosition = {x:-15,y:-11};
        this.faceOffset = {x:0,y:1};
        this.bowOffset ={x:-0,y:-0};
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
        let file = new DOMParser().parseFromString(fs.readFileSync(__dirname + "/gd//Hair/000"+id+".img/coord.xml","utf8"),"text/xml");
        let hair = file.getElementsByTagName("_"+z);
        if(hair.length == 0)
            return next();
        
        hair = hair[0];
        let prefix = "";
        if(typeof self.prefixes[z] !== "undefined")
            prefix = self.prefixes[z];
        let x = hair.getElementsByTagName("x")[0].firstChild.data;
        let y = hair.getElementsByTagName("y")[0].firstChild.data;
        self.loadImage(__dirname + "/gd//Hair/000"+id+".img/default."+(z+prefix)+".png",(image)=>
        { 
            self.canvas.drawImage(image,self.offsetX + parseInt(x),self.offsetY + parseInt(y) + self.faceOffset.y);
            next();
        });
    }
    setFace(self,parameters,next)
    {
        let id = parameters.id;
        let file = new DOMParser().parseFromString(fs.readFileSync(__dirname + "/gd//Face/000"+id+".img/coord.xml","utf8"),"text/xml");
        let x = file.getElementsByTagName("x")[0].firstChild.data;
        let y = file.getElementsByTagName("y")[0].firstChild.data;
        self.loadImage(__dirname + "/gd//Face/000"+id+".img/default.face.png",(image)=>
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
            this.loadImage(__dirname + "/gd//Face/000"+ids.face+".img/default.face.png",(image)=>
            {
                callback();
            });
        });
    }
    setCap(self,parameters,next)
    {
        let id = parameters.id;
        let z = parameters.z;
        let file = new DOMParser().parseFromString(fs.readFileSync(__dirname + "/gd//Cap/0"+id+".img/coord.xml","utf8"),"text/xml");
        let zElem;
        let nodeName;
        let elements = file.getElementsByTagName("z");
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
        self.loadImage(__dirname + "/gd//Cap/0"+id+".img/default."+nodeName+".png",(image)=>
        {
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
        let file = new DOMParser().parseFromString(fs.readFileSync(__dirname + "/gd//Accessory/0"+id+".img/coord.xml","utf8"),"text/xml");
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
        self.loadImage(__dirname + "/gd//Accessory/0"+id+".img/default.default.png",(image)=>
        {

            self.canvas.drawImage(image,self.faceOffset.x + self.offsetX + parseInt(x),self.faceOffset.y + self.offsetY + parseInt(y));
            next();
        });       
    }
    setUpperBodyCloth(self,parameters,next,type)
    {
        let id = parameters.id;
        let z = parameters.z;
        let file = new DOMParser().parseFromString(fs.readFileSync(__dirname + "/gd//"+type+"/0"+id+".img/coord.xml","utf8"),"text/xml");
        let elements = file.getElementsByTagName("z");
        let zElem;
        let nodeName;
        for(let i = 0; i < elements.length; i++)
        {
            if(elements[i].parentNode.nodeName == "stand"+self.parts.stand && elements[i].firstChild.data == z)
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
        self.loadImage(__dirname + "/gd//"+type+"/0"+id+".img/stand"+self.parts.stand+".0."+nodeName+".png",(image)=>
        {
            let position = self.body["stand"+self.parts.stand].parts[0].position;
            self.canvas.drawImage(image,self.clothOffset.x + self.offsetX + parseInt(x),self.clothOffset.y + position.y + self.offsetY + parseInt(y));
            next();
        });
    }
    setCoat(self,parameters,next)
    { 
        if(!fs.existsSync(__dirname + "/gd//Coat/0"+parameters.id+".img/coord.xml"))
            return next();
        self.setUpperBodyCloth(self,parameters,next,"Coat");
    }
    setLongCoat(self,parameters,next)
    {
        if(!fs.existsSync(__dirname + "/gd//LongCoat/0"+parameters.id+".img/coord.xml"))
            return next();
        self.setUpperBodyCloth(self,parameters,next,"LongCoat");
    }
    setPants(self,parameters,next)
    {
        let id = parameters.id;
        let z = parameters.z;
        let file = new DOMParser().parseFromString(fs.readFileSync(__dirname + "/gd//Pants/0"+id+".img/coord.xml","utf8"),"text/xml");
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
        self.loadImage(__dirname + "/gd//Pants/0"+id+".img/stand"+stand+".0.pants.png",(image)=>
        {
            let position = self.body["stand"+self.parts.stand].parts[0].position;
            self.canvas.drawImage(image,self.clothOffset.x + self.offsetX + parseInt(x),self.clothOffset.y + position.y + self.offsetY + parseInt(y));
            next();
        }); 
    }
    setShoes(self,parameters,next)
    {
        let id = parameters.id;
        let z = parameters.z;
        let file = new DOMParser().parseFromString(fs.readFileSync(__dirname + "/gd//Shoes/0"+id+".img/coord.xml","utf8"),"text/xml");
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
           return next();
        let x = zElem.getElementsByTagName("x")[0].firstChild.data;
        let y = zElem.getElementsByTagName("y")[0].firstChild.data;
        self.loadImage(__dirname + "/gd//Shoes/0"+id+".img/stand1.0.shoes.png",(image)=>
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
        let file = new DOMParser().parseFromString(fs.readFileSync(__dirname + "/gd//Glove/0"+id+".img/coord.xml","utf8"),"text/xml");
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
        self.loadImage(__dirname + "/gd//Glove/0"+id+".img/stand"+self.parts.stand+".0."+nodeName+".png",(image)=>
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
        let file = new DOMParser().parseFromString(fs.readFileSync(__dirname + "/gd//Cape/0"+id+".img/coord.xml","utf8"),"text/xml");
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
        self.loadImage(__dirname + "/gd//Cape/0"+id+".img/stand1.0.cape.png",(image)=>
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
        let file = new DOMParser().parseFromString(fs.readFileSync(__dirname + "/gd//Shield/0"+id+".img/coord.xml","utf8"),"text/xml");
        let x = file.getElementsByTagName("x")[0].firstChild.data;
        let y = file.getElementsByTagName("y")[0].firstChild.data;
        self.loadImage(__dirname + "/gd//Shield/0"+id+".img/stand1.0.shield.png",(image)=>
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
        let file = new DOMParser().parseFromString(fs.readFileSync(__dirname + "/gd//Weapon/0"+id+".img/coord.xml","utf8"),"text/xml");
        let prefix = "";
        let zElem;
        let elements = file.getElementsByTagName("z");
        let nodeName;
        for(let i = 0; i < elements.length; i++)
        {
            if(elements[i].parentNode.nodeName.includes("stand" + self.parts.stand) && elements[i].firstChild.data == z)
            {
                nodeName = elements[i].parentNode.parentNode.nodeName.replace("_","");
                zElem = elements[i].parentNode;
                break;
            }
        }
        if(zElem == null)
            return next();
        let infoStand = file.getElementsByTagName("_info")[0].getElementsByTagName(nodeName.replace("_",""))[0];
        let x = zElem.getElementsByTagName("x")[0].firstChild.data;
        let y = zElem.getElementsByTagName("y")[0].firstChild.data;
        if(infoStand != null)
        {
            let child;
            if((child = infoStand.getElementsByTagName("NUM")[0]) != null)
            {
                prefix = child.firstChild.data + ".";
            }
        }
        self.loadImage(__dirname + "/gd//Weapon/0"+id+".img/"+prefix+"stand"+self.parts.stand+".0."+nodeName+".png",(image)=>
        {
            let position = self.body["stand"+self.parts.stand].parts[0].position;
            self.canvas.drawImage(image,self.clothOffset.x + self.offsetX + self.bowOffset.x + parseInt(x),self.clothOffset.y + self.bowOffset.y + position.y + self.offsetY + parseInt(y));
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
        self.loadImage(__dirname + "/gd//Skin/0000"+id+".img/stand"+self.parts.stand+".0.body.png",(image)=>
        {
            let position = self.body["stand"+self.parts.stand].parts[0].position;
            self.canvas.drawImage(image,self.offsetX + position.x,self.offsetY + position.y);
            next();
        });
    }
    setHead(self,parameters,next)
    {
        let id = parameters.id;
        self.loadImage(__dirname + "/gd//Skin/0000"+id+".img/front.head.png",(image)=>
        {
            let position = self.body["stand"+self.parts.stand].parts[1].position;
            self.canvas.drawImage(image,self.offsetX + position.x,self.offsetY + position.y);
            next();
        });
    }
    setHands(self,parameters,next)
    {
        let id = parameters.id;
        let file = __dirname + "/gd//Skin/0000"+id+".img/stand"+self.parts.stand+".0.hand.png";
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
        self.loadImage(__dirname + "/gd//Skin/0000"+id+".img/stand"+self.parts.stand+".0.arm.png",(image)=>
        {
            let position = self.body["stand"+self.parts.stand].parts[2].position;
            self.canvas.drawImage(image,self.offsetX + position.x,self.offsetY + position.y);
            next();
        });  
    }
    equipItems(player,items,callback,index=0)
    {
        let self = this;
        if(index >= items.length - 1)
        {
            return callback(player);
        }
        if(typeof items[index].parameters.id === "undefined")
        {
 
            if(items[index].parameters.z == "mailChestOverHighest" || items[index].parameters.z == "mailChest"){
                items[index].parameters.id = 1040036;
                items[index].parameters.z = "mailChest";
                items[index].method = this.setCoat;
            }else{
                return this.equipItems(player,items,callback,++index);
            }
        }
        if(index >= items.length - 1){
            return callback(player);
        }
        items[index].method(self,items[index].parameters,()=>
        {
            if(index >= items.length - 1){
                return callback(player);
            }
            this.equipItems(player,items,callback,++index);
        });
    } 
    setWeaponInfo(id)
    {
        let file = new DOMParser().parseFromString(fs.readFileSync(__dirname + "/gd//Weapon/0"+id+".img/coord.xml","utf8"),"text/xml");
        let info = file.getElementsByTagName("_info")[0].getElementsByTagName("stand")[0].getElementsByTagName("value")[0].firstChild.data;
        this.parts.stand = parseInt(info);
    }
}
module.exports = ItemBuilder;