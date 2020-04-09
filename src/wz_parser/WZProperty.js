const WZNode = require("./WZNode");
const WzSubProperty = require("./Properties/WzSubProperty");
const WZNullProperty = require("./Properties/WZNullProperty");
const WzUnsignedShortProperty = require("./Properties/WzUnsignedShortProperty");
const WzCompressedIntProperty = require("./Properties/WzCompressedIntProperty");
const WzByteFloatProperty = require("./Properties/WzByteFloatProperty");
const WzDoubleProperty = require("./Properties/WzDoubleProperty");
const WzStringProperty = require("./Properties/WzStringProperty");
const WZCanvasProperty = require("./Properties/WZCanvasProperty");
const WzVectorProperty = require("./Properties/WzVectorProperty");
const WzUOLProperty = require("./Properties/WzUOLProperty");
const WZPngProperty = require("./Properties/WZPngProperty");

class WZProperty extends WZNode
{
    constructor(name)
    {
        super(name);
    }
    parse()
    {
        
    }
    static parseList(offset,reader,parent,parentImg)
    {

        let entryCount = reader.readWZInt();
        let props = [];
        for(let i = 0 ; i < entryCount; i++)
        {
            let name = reader.readStringBlock(offset);
            switch(reader.readByte())
            {
                case 0:
                    props.push(new WZNullProperty(name).setParent(parent));
                    break;
                case 0x0B:
                case 2:
                    props.push(new WzUnsignedShortProperty(name,reader.readUInt16()).setParent(parent));
                    break;
                case 3:
                    props.push(new WzCompressedIntProperty(name,reader.readWZInt()).setParent(parent));
                    break;
                case 4:
                    let type = reader.readByte();
                    if(type==0x80)
                        props.push(new WzByteFloatProperty(name, reader.readSingle()).setParent(parent));
                    else if(type==0)
                        props.push(new WzByteFloatProperty(name, 0).setParent(parent));
                    break;
                case 5:
                    props.push(new WzDoubleProperty(name, reader.readDouble()).setParent(parent));
                    break;
                case 8:
                    props.push(new WzStringProperty(name, reader.readStringBlock(offset)).setParent(parent));
                    break;
                case 9:
                    let eob = reader.readUInt32() + reader.pos;
                    //console.log("eob: ",eob);
                    let exProp = WZProperty.parseExtendedProp(reader,offset,eob,name,parent,parentImg);
                    props.push(exProp);
                    if(reader.pos != eob) reader.pos = eob;
                    break;
                default:
                    throw("unkown property");
            }
        }
        return props;
    }
    static parseExtendedProp(reader,offset,eob,name,parent,parentImg)
    {
        switch(reader.readByte())
        {
            case 0x1B:
                return WZProperty.extractMore(reader,offset,eob,name,reader.readStringAtOffset(offset+reader.readInt32()),parent,parentImg);
                break;
            case 0x73:
                return WZProperty.extractMore(reader,offset,eob,name,"",parent,parentImg)
                break;
            default:
                throw("Invalid byted readed at parseExtendedProp");
        }
    }

    static extractMore(reader,offset,eob,name,iname,parent,imgParent)
    {
        if(iname=="")
            iname = reader.readEncryptedString();

        switch(iname)
        {
            case "Property":
                let subProp = new WzSubProperty(name).setParent(parent);
                reader.skip(2);
                subProp.addProperties(WZProperty.parseList(offset,reader,subProp,imgParent));
                return subProp;
            case "Canvas":
                let canvas = new WZCanvasProperty(name).setParent(parent);
                reader.skip(1);
                if(reader.readByte() == 1)
                {
                    reader.skip(2);
                    canvas.addProperties(WZProperty.parseList(offset,reader,canvas,imgParent));
                }
                canvas.png = new WZPngProperty(reader,imgParent.parseEverything,canvas);
                return canvas;
            case "Shape2D#Vector2D":
                let vecProp = new WzVectorProperty(name).setParent(parent);
                vecProp.x = reader.readWZInt();
                vecProp.y = reader.readWZInt();
                return vecProp;
            case "Shape2D#Convex2D":
                let convexProp = new WzConvexProperty(name).setParent(parent);
                let convexEntryCount = reader.readerWZInt();
                convexProp.props.Capacity = convexEntryCount; //performance thing
                for (let i = 0; i < convexEntryCount; i++)
                {
                    convexProp.AddProperty(WZProperty.parseExtendedProp(reader, offset, 0, name, convexProp, imgParent));
                }
                return convexProp;  
            case "UOL":
                reader.skip(1);
                switch (reader.readByte())
                {
                    case 0:
                        return new WzUOLProperty(name, reader.readEncryptedString()).setParent(parent);
                    case 1:
                        return new WzUOLProperty(name, reader.readStringAtOffset(offset + reader.readInt32())).setParent(parent);
                }    
        }
    }
}
module.exports = WZProperty;