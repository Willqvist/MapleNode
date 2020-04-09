import fs, {PathLike} from "fs";
import PNG from "pngjs";
import Canvas from "./Canvas";
export default class ImageBuilder
{
    loadImage(image : PathLike,callback : (PNG)=>void)
    {
        if(!fs.existsSync(image))
        {
            callback(null);
            return;
        }
        fs.createReadStream(image)
        .pipe(new PNG())
        .on('parsed',function()
        {
            callback(this);
        });
    }
    loadMultibleImages(images : PathLike[],callback:(any)=>void)
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
    outputImage(canvas : Canvas,src,callback)
    {
        canvas.image().pack()
        .pipe(fs.createWriteStream(src))
        .on('finish',function(err) {
            callback();
        });
        canvas.clearCanvas();
    }
}
