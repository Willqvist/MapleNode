import {PNG} from "pngjs";
export default class Canvas
{
    private width : number;
    private height : number;
    private color : number;
    private canvas : PNG;

    constructor(width,height)
    {
        this.canvas = new PNG({width:width,height:height});
        this.width = width;
        this.height = height;
        this.color = 0x0000FF;
    }
    fillColor(color)
    {
        this.color = color;
    }
    image() : PNG
    {
        return this.canvas;
    }
    clearCanvas()
    {
        let can = new PNG({width:this.canvas.width,height:this.canvas.height});
        this.canvas = can;
    }
    drawImage(image,x : number,y : number)
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
                    red:image.data[loadedImagePosition+ColorIndex.RED],
                    green:image.data[loadedImagePosition+ColorIndex.GREEN],
                    blue:image.data[loadedImagePosition+ColorIndex.BLUE],
                    alpha:image.data[loadedImagePosition+ColorIndex.ALPHA]/255
                }
                this.canvas.data[position + ColorIndex.RED] = col.red * col.alpha + this.canvas.data[position + ColorIndex.RED] * (1-col.alpha);
                this.canvas.data[position + ColorIndex.GREEN] = col.green * col.alpha + this.canvas.data[position + ColorIndex.GREEN] * (1-col.alpha);
                this.canvas.data[position + ColorIndex.BLUE] = col.blue * col.alpha + this.canvas.data[position + ColorIndex.BLUE] * (1-col.alpha);
                this.canvas.data[position + ColorIndex.ALPHA] = 0xFF;
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
                this.canvas.data[position + ColorIndex.RED] = (this.color >> 16) & 0xFF;
                this.canvas.data[position + ColorIndex.GREEN] = (this.color >> 8) & 0xFF;
                this.canvas.data[position + ColorIndex.BLUE] = (this.color >> 0) & 0xFF;
                this.canvas.data[position + ColorIndex.ALPHA] = 0xff;
            }
        }
    }
}

enum ColorIndex {
    RED,
    GREEN,
    BLUE,
    ALPHA,
}
