const ImageProperty = require("./ImageProperty");
const SimpSimpleWritableBuffer = require("../SimpleWritableBuffer");
const WZReader = require("../WZReader");
const PNG = require("pngjs").PNG;
const ImageStorer = require("../ImageStorer");
const fs = require("graceful-fs");
class WZPngProperty extends ImageProperty
{
    constructor(reader,parseNow,parent)
    {
        super("");
        this.name = "PNG";
        this.width = reader.readWZInt();
        this.height = reader.readWZInt();
        this.format = reader.readWZInt();
        this.format2 = reader.readByte();
        this.parent = parent;
        this.png;
        this.type="PNG";
        reader.skip(4);
        //console.log(this.parent.getPath(),parseNow);
        this.offs = reader.pos;
        let len = reader.readInt32()-1;
        reader.skip(1);

        if(len > 0)
        {
            if(parseNow)
            {
                this.bytes = reader.readBytes(len);
                this.parsePng();
            }
            else
            {
                reader.skip(len);
            }
        }
        this.reader = reader;
    }
    createImage(storer,src,callback)
    {
        if(this.png == null)
        {
            let pos = this.reader.pos;
            this.reader.seek(this.offs);
            let len = this.reader.readInt32()-1;
            this.reader.skip(1);
            if(len > 0)
                this.bytes = this.reader.readBytes(len);
            this.parsePng();
            this.reader.seek(pos);
        }
        //pipe image to file...
        //console.log(dir,src);
        if(this.png)
            storer.addImage(this.png,src,callback);
    }
    pad8(str)
    {
        return str.padStart(8,'0');
    }
    storePng(storer,dest,callback,name)
    {
        let dir = dest+this.pad8(this.parent.parent.parent.name.replace(".img",""))+"/";
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir,{ recursive: true });
        }
        let src;

        if(!name)
            src = dir + this.parent.name + ".png";
        else
            src = dir + name + ".png";

        this.createImage(storer,src,callback);
    }
    ArgbToRgba()
    {
        for(let i = 0; i < this.png.data.length; i+=4)
        {
            let red = this.png.data[i];
            this.png.data[i] = this.png.data[i+2];
            this.png.data[i+2] = red;
        }
    }
    parsePng()
    {
        if(this.parsed) return;
        let uncompressedSize = 0;
        let x = 0,y = 0, b = 0,g = 0;
        let bmp;
        let imgParent = this.parentImg();

        let reader = new WZReader(Buffer.from(this.bytes));
        let header = reader.readUInt16();
        let listWzUsed = header != 0x9C78 && header != 0xDA78;
        let dataStream;
        if(!listWzUsed)
        {
            dataStream = new SimpSimpleWritableBuffer();
            dataStream.buffer = reader.buffer;
            if(!dataStream.inflate())
            {
                return;
            }
        }
        else
        {
            reader.skip(-2);
            dataStream = new SimpSimpleWritableBuffer();
            let blockSize = 0;
            let endOfPng = this.bytes.length;
            while(reader.pos < endOfPng)
            {
                blockSize = reader.readInt32();
                // write array to file
                for(let i = 0; i < blockSize; i++)
                {
                    dataStream.writeByte(reader.readByte() ^ imgParent.reader.wzKey[i]);
                }
            }
            dataStream.pos = 2;
            if(!dataStream.inflate())
            {
                return;
            }
        }
        switch(this.format + this.format2)
        {
            case 1:
            {
                bmp = new PNG({width:this.width,height:this.height});
                uncompressedSize = this.width*this.height*2;
                let decBuf = dataStream.read(0,uncompressedSize);
                for(let i = 0; i < uncompressedSize; i ++)
                {
                    /*
                    r = decBuf[i/2] & 0xF0; r |= (r >> 4); bmp.data[i] = r; // g
                    g = decBuf[i/2+1] & 0x0F; g |= (g << 4); bmp.data[i + 1] = g; // b
                    b = decBuf[i/2+1] & 0xF0; b |= (b >> 4); bmp.data[i + 2] = b; // g
                    a = decBuf[i/2] & 0x0F; a |= (a << 4); bmp.data[i + 3] = a; // b
                    */
                   /// fixa fel färg manipulation
                    b = decBuf[i] & 0x0F; b |= (b << 4); bmp.data[i * 2] = b;
                    g = decBuf[i] & 0xF0; g |= (g >> 4); bmp.data[i * 2 + 1] = g;
                }
                //console.log(uncompressedSize);
                //console.log("FULL PATH: ",this.parent.getPath());
                break;
            }
            case 2:
            {
                bmp = new PNG({width:this.width,height:this.height});
                uncompressedSize = this.width*this.height*4;
                let decBuf = [];
                decBuf = dataStream.read(0,uncompressedSize);
                for(let i = 0; i < uncompressedSize; i++)
                    bmp.data[i] = decBuf[i];
                break;
            }
            case 513:
            {
                bmp = new PNG({width:this.width,height:this.height});
                uncompressedSize = this.width*this.height*2;
                let decBuf = [];
                decBuf = dataStream.read(0,uncompressedSize);
                for(let i = 0; i < uncompressedSize; i++)
                    bmp.data[i] = decBuf[i];
                
                break;              
            }
            case 517:
            {
                bmp = new PNG({width:this.width,height:this.height});
                uncompressedSize = this.width*this.height / 128;
                let decBuf = [];
                decBuf = dataStream.read(0,uncompressedSize);
                let ib = 0;
                for(let i = 0; i < uncompressedSize; i++)
                {
                    for (let j = 0; j < 8; j++)
                    {
                        ib = ((decBuf[i] & (0x01 << (7 - j))) >> (7 - j)) * 0xFF;
                        for (let k = 0; k < 16; k++)
                        {
                            if(x==width){x=0;y++}
                            let pos = (x+y*this.width) << 2;
                            bmp.data[position + 0] = ib;
                            bmp.data[position + 1] = ib;
                            bmp.data[position + 2] = ib;
                            bmp.data[position + 3] = 0xFF;
                            x++;
                        }
                    }
                }
                break;    
            }
        }
        this.parsed=true;
        this.png = bmp;
        this.ArgbToRgba();
        //this.storePng("../library/v62/images/"+this.parentImg().name.replace(".img",".png"));
        // FIX WZImgPng...
    }
}
module.exports = WZPngProperty;