const crytpoConstants = require("./CryptoConstants");
const Tools = require("./Tools");
const uint32 = require('uint32');
class WZReader
{
    constructor(buffer,wzKey=null)
    {
        this.buffer = buffer;
        this.pos = 0;
        if(wzKey)
            this.wzKey = Tools.GenerateWzKey(wzKey);
    }
    readInt32()
    {
        this.pos += 4;
        return this.buffer.readInt32LE(this.pos - 4);
    }
    readInt8()
    {
        this.pos += 1;
        return this.buffer.readInt8(this.pos - 1);
    }
    readInt16()
    {
        this.pos += 2;
        return this.buffer.readInt16LE(this.pos - 2);
    }
    readInt64()
    {
        let bytes = this.buffer.slice(this.pos,8);
        this.pos += 8;
        let value = 0;
        for ( let i = bytes.length - 1; i >= 0; i--)
            value = (value * 256) + bytes[i];
        return value;
    }

    readUInt32()
    {
        this.pos += 4;
        return this.buffer.readUInt32LE(this.pos - 4);
    }
    readUInt16()
    {
        this.pos += 2;
        return this.buffer.readUInt16LE(this.pos - 2);
    }
    readUInt64()
    {
        let bytes = this.buffer.slice(this.pos,8);
        this.pos += 8;
        let value = 0;
        for ( var i = bytes.length - 1; i >= 0; i--) {
            value = (value * 256) + bytes[i];
        }
        return value;
    }
    printInt32(ia)
    {
        for(let i = 4; i >=1; i--)
        {
            console.log("bit:", (ia >> i) && 0xff);
        }
        return "";
    }
    readString(size,type='ascii')
    {
        let bytes = this.buffer.slice(this.pos,size);
        this.pos += size;
        return bytes.toString(type,0,bytes.length);
    }
    readBytes(size)
    {
        let bytes = this.buffer.slice(this.pos,this.pos+size);
        this.pos += size;
        return bytes;
    }
    readStringBlock(offset)
    {
        switch (this.readByte())
        {
            case 0:
            case 0x73:
                return this.readEncryptedString();
            case 1:
            case 0x1B:
                return this.readStringAtOffset(offset + this.readInt32());
            default:
                return "";
        }
    }
    readStringAtOffset(offset,readByte=false)
    {
        let curOffset = this.pos;
        this.seek(offset);
        if(readByte)
            this.readByte();
        let str = this.readEncryptedString();
        this.seek(curOffset);
        return str;
    }
    readSingle()
    {
        this.pos += 4;
        return this.buffer.readFloatLE(this.pos - 4);
    }
    readDouble()
    {
        this.pos += 8;
        return this.buffer.readDoubleLE(this.pos - 8);
    }
    readEncryptedString()
    {
      let smallLength = this.readSByte();
      if(smallLength==0)
      {
          return "";
      }  
      let length;
      let str = "";
      if(smallLength > 0) // Unicode
      {
        let mask = 0xAAAA;
        if(smallLength == 127)
        {
            length = this.readInt32();
        }
        else
        {
            length = smallLength;
        }
        if(length <= 0)
        {
            return "";
        }

        for(let i = 0; i < length; i++)
        {
            let encryptedChar = this.readUInt16();
            encryptedChar ^= mask;
            encryptedChar ^= (this.wzKey[i*2+1] << 8) + this.wzKey[i*2];
            str = str.concat(String.fromCharCode(encryptedChar) + "");
        }
      }
      else //ASCII
      {
        let mask = 0xAA;
        if(smallLength == -128)
            length = this.readInt32();
        else
            length = -smallLength;
        if(length <= 0)
            return "";
        for(let i = 0; i < length; i++)
        {
            let encryptedChar = this.readByte();
            encryptedChar ^= mask;
            encryptedChar ^= (this.wzKey[i]);
            str = str.concat(String.fromCharCode(encryptedChar) + "");
            mask++;
        } 
      }
      return str;
    }
    readSByte()
    {
        return this.readInt8();
    }
    readByte()
    {
        this.pos ++;
        return this.buffer[this.pos-1];
    }
    readUInt8()
    {
        this.pos ++
        let byte = this.buffer[this.pos-1];
        if((byte >> 7) & 0x1 == 1)
        {
            let max = -128;
            byte &= 0b01111111;
            return max + byte;
        }
        else
        {
            return byte;
        }
    }
    printByte(byte,size=1)
    {
        let str ="";
        for(let i = (8*size)-1; i >= 0; i--)
        {
           str = str.concat(((byte >> i) & 0x1)+",");
        }
        console.log(str,byte);
    }
    readWZInt()
    {
        let size;
        if((size = this.readSByte())==-128){
            return this.readInt32();
        }
        return size;
    }
    readZString(type='ascii')
    {
        let size = 0;
        let str = "";
        let byte;
        while((byte=this.buffer[this.pos + size]) != 0)
        {
            if(size > this.buffer.length)
            {
                return null;
            }
            str=str.concat(""+String.fromCharCode(byte));
            size++;
        }
        this.pos += size;
        return str;
    }
    readOffset()
    {
        let offset = this.pos;
        //uint max value = 4,294,967,295;
        offset = uint32.xor(0,(offset - this.header.contentStart),4294967295);
        let result = new Uint32Array(2);

        uint32.mult(offset,this.hash,result);
        offset = result[1];

        offset -= crytpoConstants.WZ_OffsetConstant;
        offset = uint32.rotateLeft(offset,offset & 0x1F);

        let encryptedOffset = this.readUInt32();

        offset = uint32.xor(0,offset,encryptedOffset);
        offset += this.header.contentStart *2;

        return offset;
    }
    reset()
    {
        this.pos = 0;
    }
    skip(skip)
    {
        this.pos += skip;
    }
    seek(seek)
    {
        this.pos = seek;
    }
}
module.exports = WZReader;