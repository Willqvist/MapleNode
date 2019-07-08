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
        if(image == null) return;
        for(let i = x; i < Math.min(x+image.width,this.width); i++)
        {
            for(let j = y; j < Math.min(y+image.height,this.height); j++)
            {
                let loadedImagePosition = ((i-x+(j-y)*image.width) << 2);
                if(image.data[loadedImagePosition+3] == 0) continue;
                let position = (i+j*this.width) << 2;
                let col =
                {
                    red:image.data[loadedImagePosition+this.ColorIndex.RED],
                    green:image.data[loadedImagePosition+this.ColorIndex.GREEN],
                    blue:image.data[loadedImagePosition+this.ColorIndex.BLUE],
                    alpha:image.data[loadedImagePosition+this.ColorIndex.ALPHA]/255
                }
                this.canvas.data[position + this.ColorIndex.RED] = col.red * col.alpha + this.canvas.data[position + this.ColorIndex.RED] * (1-col.alpha);
                this.canvas.data[position + this.ColorIndex.GREEN] = col.green * col.alpha + this.canvas.data[position + this.ColorIndex.GREEN] * (1-col.alpha);
                this.canvas.data[position + this.ColorIndex.BLUE] = col.blue * col.alpha + this.canvas.data[position + this.ColorIndex.BLUE] * (1-col.alpha);
                this.canvas.data[position + this.ColorIndex.ALPHA] = 0xFF;
            }  
        }
    }
    drawRect(x,y,width,height)
    {
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