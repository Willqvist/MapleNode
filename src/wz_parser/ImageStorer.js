const fs = require("graceful-fs");
const FileQueue = require('filequeue');
const PNG = require("pngjs").PNG;

class ImageStorer
{
    constructor()
    {
        this.images = [];
        this.hasCallback = false;
        this.callback;
        this.done = false;
        this.isFilling = true;
        this.index = 0;
        this.piped = {};
        this.piping = 0;
    }
    addImage(image,src)
    {
        this.piping ++;
        this.saveImage({image:image,src:src});
    }
    setCallbackComplete(callback)
    {
        this.hasCallback = true;
        this.callback = callback;
    }
    saveImage(image)
    {
        let buffer = PNG.sync.write(image.image,{colorType:6});
        fs.writeFileSync(image.src,buffer);
        /*

        image.image.pack()
        .pipe(fs.createWriteStream(image.core))
        .on('finish',(function() {
            console.log("done piping image",this.piping);
            this.piping --;
            console.log("done piping image");
            if(this.piping == 0)
            {
                if(this.hasCallback)
                this.callback();
            }
        }).bind(this));
        */
    }
}
ImageStorer.queue = new FileQueue(100000);
ImageStorer.i = 0;
module.exports = ImageStorer;
