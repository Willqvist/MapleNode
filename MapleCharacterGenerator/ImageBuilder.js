const Canvas = require("./Canvas");
const fs = require("fs");
const PNG = require("pngjs").PNG;
class ImageBuilder
{
    loadImage(image,callback)
    {
        fs.createReadStream(image)
        .pipe(new PNG())
        .on('parsed',function()
        {
            callback(this);
        });
    }
    loadMultibleImages(images,callback)
    {
        let pngs = [];
        let index = 0;
        let imageLoaded = 0;
        for(let i = 0; i < images.length; i++)
        {
            this.loadImage(images[i],((image)=>
            {
                imageLoaded++;
                pngs[i] = image;
                if(imageLoaded>= images.length)
                    callback(pngs);
            }).bind(i));
        }
    }
    outputImage(canvas, src,callback)
    {
        canvas.image.pack()
        .pipe(fs.createWriteStream(src))
        .on('finish',function() {

            callback();
        });
        canvas.clearCanvas();
    }
}
module.exports = ImageBuilder;