import fs, {PathLike} from "fs";
import Canvas from "./Canvas";
import ImageBuilder from "./ImageBuilder";
import {PartsInterface} from "../src/tools/Interfaces";


export default class ItemBuilder extends ImageBuilder
{
    // 145200-1452155 OFFSET
    //
    private canvas: Canvas;
    private offsetX: number;
    private offsetY: number;
    private parts: PartsInterface;
    private clothOffset: { x: number; y: number };
    private headPosition: { x: number; y: number };
    private faceOffset: { x: number; y: number };
    private bowOffset: { x: number; y: number };
    private prefixes: { hairShade: string };
    private body: { stand2: { head: { position: { x: number; y: number } }; body: { position: { x: number; y: number } }; arm: { position: { x: number; y: number } }; hand: { position: { x: number; y: number } } }; stand1: { head: { part: string; position: { x: number; y: number } }; body: { position: { x: number; y: number } }; arm: { position: { x: number; y: number }; type: string } } };
    private parser: DOMParser;

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
                body:{
                        position:{x:7+this.headPosition.x,y:33+this.headPosition.y}
                    },
                head:{
                        part:"head",
                        position:this.headPosition
                    },
                arm:{
                        type:"arm",
                        position:{x:23+this.headPosition.x,y:35+this.headPosition.y}
                    },
            },
            stand2:
            {
                body:{
                        position:{x:8+this.headPosition.x,y:33+this.headPosition.y}
                    },
                head:{
                        position:this.headPosition
                    },
                arm:{
                        position:{x:19+this.headPosition.x,y:35+this.headPosition.y}
                    },
                hand:{
                        position:{x:5+this.headPosition.x,y:38+this.headPosition.y}
                    }
            }
        };
        this.parser = new DOMParser();
    }

    getParsed(type,id){
        return this.parser.parseFromString(fs.readFileSync(this.getPath(type,id)+`coord.xml`,"utf8"),"text/xml");
    }

    getPath(type,id){
        return __dirname + `/gd//${type}/${(id+"").padStart(8,'0')}.img/`; 
    }

    setHair(id,z,next)
    {
        if(typeof this.parts.cap !== "undefined" && z == "hairOverHead")
            return next();

        let file = this.getParsed("Hair",id);
        let hairs = file.getElementsByTagName("_"+z);
        if(hairs.length == 0)
            return next();
        
        let hair = hairs[0];
        let prefix = "";
        if(typeof this.prefixes[z] !== "undefined")
            prefix = this.prefixes[z];
        let x = hair.getElementsByTagName("x")[0].firstChild.textContent;
        let y = hair.getElementsByTagName("y")[0].firstChild.textContent;
        this.loadImage(__dirname + "/gd//Hair/000"+id+".img/default."+(z+prefix)+".png",(image)=>
        { 
            this.canvas.drawImage(image,this.offsetX + parseInt(x),this.offsetY + parseInt(y) + this.faceOffset.y);
            next();
        });
    }
    
    setFace(id,z,next)
    {
        let file = this.getParsed("Face",id);
        let x = file.getElementsByTagName("x")[0].firstChild.data;
        let y = file.getElementsByTagName("y")[0].firstChild.data;
        this.loadImage(__dirname + "/gd//Face/000"+id+".img/default.face.png",(image)=>
        {
            this.canvas.drawImage(image,this.offsetX + parseInt(x)+this.faceOffset.x,this.offsetY + parseInt(y)+this.faceOffset.y);
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
            this.loadImage(this.getPath("Face",ids.face)+"default.face.png",(image)=>
            {
                callback();
            });
        });
    }
    setCap(id,z,next)
    {
        let file = this.getParsed("Cap",id);
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
        this.loadImage(this.getPath("Cap",id)+"default."+nodeName+".png",(image)=>
        {
            let position = this.body["stand"+this.parts.stand].body.position;
            this.canvas.drawImage(image,this.offsetX + parseInt(x),this.offsetY + parseInt(y) + this.faceOffset.y);
            next();
        });
    }
    setMask(id,z,next)
    {

    }
    setEars(id,z,next)
    {
    }
    setAccessory(id,z,next)
    {
        let file = this.getParsed("Accessory",id);
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
        this.loadImage(this.getPath("Accessory",id)+"default.default.png",(image)=>
        {

            this.canvas.drawImage(image,this.faceOffset.x + this.offsetX + parseInt(x),this.faceOffset.y + this.offsetY + parseInt(y));
            next();
        });       
    }
    setUpperBodyCloth(id,z,next,type)
    {
        let file = this.getParsed(type,id);
        let elements = file.getElementsByTagName("z");
        let zElem;
        let nodeName;
        for(let i = 0; i < elements.length; i++)
        {
            if(elements[i].parentNode.nodeName == "stand"+this.parts.stand && elements[i].firstChild.data == z)
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
        this.loadImage(this.getPath(type,id)+"stand"+this.parts.stand+".0."+nodeName+".png",(image)=>
        {
            let position = this.body["stand"+this.parts.stand].body.position;
            this.canvas.drawImage(image,this.clothOffset.x + this.offsetX + parseInt(x),this.clothOffset.y + position.y + this.offsetY + parseInt(y));
            next();
        });
    }
    setCoat(id,z,next)
    { 
        if(!fs.existsSync(this.getPath("Coat",id)+"coord.xml"))
            return next();
        this.setUpperBodyCloth(id,z,next,"Coat");
    }
    setLongCoat(id,z,next)
    {
        if(!fs.existsSync(this.getPath("LongCoat",id)+"coord.xml"))
            return next();
        this.setUpperBodyCloth(id,z,next,"LongCoat");
    }
    setPants(id,z,next)
    {
        let file = this.getParsed("Pants",id);
        let elements = file.getElementsByTagName("z");
        let zElem;
        for(let i = 0; i < elements.length; i++)
        {
            if(elements[i].parentNode.nodeName.includes("stand"+this.parts.stand) && elements[i].firstChild.data == z)
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
        this.loadImage(this.getPath("Pants",id)+"stand"+stand+".0.pants.png",(image)=>
        {
            let position = this.body["stand"+this.parts.stand].body.position;
            this.canvas.drawImage(image,this.clothOffset.x + this.offsetX + parseInt(x),this.clothOffset.y + position.y + this.offsetY + parseInt(y));
            next();
        }); 
    }
    setShoes(id,z,next)
    {
        let file = this.getParsed("Shoes",id);
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
        this.loadImage(this.getPath("Shoes",id)+"stand1.0.shoes.png",(image)=>
        {
            let position = this.body["stand"+this.parts.stand].body.position;
            this.canvas.drawImage(image,this.clothOffset.x + this.offsetX + parseInt(x),this.clothOffset.y + position.y + this.offsetY + parseInt(y));
            next();
        });
    }
    setGloves(id,z,next)
    {
        let file = this.getParsed("Glove",id);
        let elements = file.getElementsByTagName("z");
        let zElem = [];
        let positions = [];
        let nodeName;
        for(let i = 0; i < elements.length; i++)
        {
            if(elements[i].parentNode.nodeName.replace("_","") == "stand"+this.parts.stand && elements[i].firstChild.data == z)
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
        this.loadImage(this.getPath("Glove",id)+"stand"+this.parts.stand+".0."+nodeName+".png",(image)=>
        {
            let position = this.body["stand"+this.parts.stand].body.position;
            for(let i = 0; i < positions.length;i++)
            {
                this.canvas.drawImage(image,this.clothOffset.x + this.offsetX + parseInt(positions[i].x),this.clothOffset.y + position.y + this.offsetY + parseInt(positions[i].y));
            }
            next();
        }); 
    }
    setCape(id,z,next)
    {
        let file = this.getParsed("Cape",id);
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
        this.loadImage(this.getPath("Cape",id)+"stand1.0.cape.png",(image)=>
        {
            let position = this.body["stand"+this.parts.stand].body.position;
            this.canvas.drawImage(image,this.clothOffset.x + this.offsetX + parseInt(x),this.clothOffset.y + position.y + this.offsetY + parseInt(y));
            next();
        });        
    }  
    setShield(id,z,next)
    {
        if(this.parts.stand != 1)
            return next();
        let file = this.getParsed("Shield",id);
        let x = file.getElementsByTagName("x")[0].firstChild.data;
        let y = file.getElementsByTagName("y")[0].firstChild.data;
        this.loadImage(__dirname + "/gd//Shield/0"+id+".img/stand1.0.shield.png",(image)=>
        {
            let position = this.body["stand"+this.parts.stand].body.position;
            this.canvas.drawImage(image,this.clothOffset.x + this.offsetX + parseInt(x),this.clothOffset.y + position.y + this.offsetY + parseInt(y));
            next();
        });
    }
    setWeapon(id,z,next)
    {
        let file = this.getParsed("Weapon",id);
        let prefix = "";
        let zElem;
        let elements = file.getElementsByTagName("z");
        let nodeName;
        for(let i = 0; i < elements.length; i++)
        {
            if(elements[i].parentNode.nodeName.includes("stand" + this.parts.stand) && elements[i].firstChild.data == z)
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
        this.loadImage(this.getPath("Weapon",id)+prefix+"stand"+this.parts.stand+".0."+nodeName+".png",(image)=>
        {
            let position = this.body["stand"+this.parts.stand].body.position;
            this.canvas.drawImage(image,this.clothOffset.x + this.offsetX + this.bowOffset.x + parseInt(x),this.clothOffset.y + this.bowOffset.y + position.y + this.offsetY + parseInt(y));
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
    setTorso(id,z,next)
    {
        this.loadImage(this.getPath("Skin",id)+"stand"+this.parts.stand+".0.body.png",(image)=>
        {
            let position = this.body["stand"+this.parts.stand].body.position;
            this.canvas.drawImage(image,this.offsetX + position.x,this.offsetY + position.y);
            next();
        });
    }
    setHead(id,z,next)
    {
        this.loadImage(this.getPath("Skin",id)+"front.head.png",(image)=>
        {
            let position = this.body["stand"+this.parts.stand].head.position;
            this.canvas.drawImage(image,this.offsetX + position.x,this.offsetY + position.y);
            next();
        });
    }
    setHands(id,z,next)
    {
        let file = this.getPath("Skin",id)+"/stand"+this.parts.stand+".0.hand.png";
        if(!fs.existsSync(file))
            return next();
        this.loadImage(file,(image)=>
        {
            let position = this.body["stand"+this.parts.stand].hand.position;
            this.canvas.drawImage(image,this.offsetX + position.x,this.offsetY + position.y);
            next();
        });
    }
    setArm(id,z,next)
    {
        this.loadImage(this.getPath("Skin",id)+"stand"+this.parts.stand+".0.arm.png",(image)=>
        {
            let position = this.body["stand"+this.parts.stand].arm.position;
            this.canvas.drawImage(image,this.offsetX + position.x,this.offsetY + position.y);
            next();
        });  
    }
    equipItems(player,items,callback,index=0)
    {
        if(index >= items.length - 1)
        {
            return callback(player);
        }
        
        let item = items[index];
        let id = item.parameters.id;
        let z = item.parameters.z;

        if(typeof id === "undefined")
        {
 
            if(z == "mailChestOverHighest" || z == "mailChest"){
                id = 1040036;
                z = "mailChest";
                item.method = this.setCoat;
            }else{
                return this.equipItems(player,items,callback,++index);
            }
        }
        let method = item.method.bind(this);
        method(id,z,()=>this.equipItems(player,items,callback,++index));
    } 
    setWeaponInfo(id)
    {
        let file = this.parser.parseFromString(fs.readFileSync(__dirname + "/gd//Weapon/0"+id+".img/coord.xml","utf8"),"text/xml");
        let info = file.getElementsByTagName("_info")[0].getElementsByTagName("stand")[0].getElementsByTagName("value")[0].firstChild.data;
        this.parts.stand = parseInt(info);
    }
}
