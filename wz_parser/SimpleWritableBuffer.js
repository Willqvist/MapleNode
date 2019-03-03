const zlib = require('zlib');
const pako = require('pako');

class SimpleWritableBuffer
{
    constructor()
    {
        this.pos = 0;
        this.buffer = Buffer.allocUnsafe(8).fill(0);
        this.hasDeflated=false;
    }
    writeByte(byte)
    {
        if(this.pos >= this.buffer.length)
        {
            console.log(this.buffer.length*2);
            this.realloc(this.buffer.length*2);
        }
        this.buffer[this.pos] = byte;
        this.pos ++;
    }
    writeBytes(bytes)
    {
        for(let i = 0; i < bytes.length; i++)
        {
            this.writeByte(bytes[i]);
        }
    }    
    inflate()
    {
        this.hasDeflated = true;
        try
        {
            this.buffer = pako.inflate(this.buffer);
            return true;
        }catch(err)
        {
            return false;
        }
    }
    empty()
    {
        this.buffer = new Buffer(8);
        this.pos = 0;
    }
    realloc(size)
    {
        let buf = Buffer.allocUnsafe(size).fill(0);
        for(let i = 0; i < this.buffer.length; i++)
        {
            buf[i]=this.buffer[i];
        }
        this.buffer = buf;
    }
    getBuffer()
    {
        return this.buffer;
    }
    read(offset, size)
    {
        //if(!this.hasDeflated) return;
        let buffer = Buffer.allocUnsafe(size-1).fill(0);
        let new_buf = this.buffer.slice(this.pos+offset,this.pos+offset+size);
        for(let i = 0; i < new_buf.length; i++)
        {
            buffer[i] = new_buf[i];
        }
        return buffer;
    }
}
module.exports = SimpleWritableBuffer;