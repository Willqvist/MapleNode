const fs = require("fs");
const PNG = require("pngjs").PNG;
class Canvas
{
    constructor(width,height)
    {
        this.canvas = new PNG({width:width,height:height});
        this.width = width;
        this.height = height;
        this.color = 0x0000FF;
        this.ColorIndex = 
        {
            RED:0,
            GREEN:1,
            BLUE:2,
            ALPHA:3
        }
    }
    set fillColor(color)
    {
        this.color = color;
    }
    get image()
    {
        return this.canvas;
    }
    clearCanvas()
    {
        let can = new PNG({width:this.canvas.width,height:this.canvas.height});
        this.canvas = can; 
    }
    drawImage(image,x,y)
    {
        for(let i = x; i < Math.min(x+image.width,this.width); i++)
        {
            for(let j = y; j < Math.min(y+image.height,this.height); j++)
            {
                let loadedImagePosition = ((i-x+(j-y)*image.width) << 2);
                if(image.data[loadedImagePosition+3] == 0) continue;
                let position = (i+j*this.width) << 2;
                this.canvas.data[position + this.ColorIndex.RED] = image.data[loadedImagePosition+this.ColorIndex.RED];
                this.canvas.data[position + this.ColorIndex.GREEN] = image.data[loadedImagePosition+this.ColorIndex.GREEN];
                this.canvas.data[position + this.ColorIndex.BLUE] = image.data[loadedImagePosition+this.ColorIndex.BLUE];
                this.canvas.data[position + this.ColorIndex.ALPHA] = image.data[loadedImagePosition+this.ColorIndex.ALPHA];
            }  
        }
    }
    drawRect(x,y,width,height)
    {
        console.log("color(",(this.color >> 16) & 0xFF,(this.color >> 8) & 0xFF,(this.color) & 0xFF,")");
        for(let i = x; i < Math.min(x+width,this.width); i++)
        {
            for(let j = y; j < Math.min(y+height,this.height); j++)
            {
                let position = (i+j*this.width) << 2;
                this.canvas.data[position + this.ColorIndex.RED] = (this.color >> 16) & 0xFF;
                this.canvas.data[position + this.ColorIndex.GREEN] = (this.color >> 8) & 0xFF;
                this.canvas.data[position + this.ColorIndex.BLUE] = (this.color >> 0) & 0xFF;
                this.canvas.data[position + this.ColorIndex.ALPHA] = 0xff;
            }  
        }
    }
}
module.exports = Canvas;