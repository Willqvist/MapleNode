const fs = require("graceful-fs");
const FileQueue = require('filequeue');

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
        if(this.piped[src])
            return;
        this.piped[src] = {};
        this.piping ++;
        this.images.push({image:image,src:src});
        this.saveImage();
    }
    setCallbackComplete(callback)
    {
        this.hasCallback = true;
        this.callback = callback;
    }
    complete()
    {
        this.isFilling = false;
        this.saveImage();
    }
    static getQueue()
    {
        console.log(++ImageStorer.i);
        return ImageStorer.queue;
    }
    saveImage(names)
    {
        if(this.index >= this.images.length)
        {
            if(this.hasCallback && !this.isFilling)
            {
                this.done = true;
                this.images = [];
            }
            return;
        }
        let image = this.images[this.index++];

        console.log("piping image",image.src);
        image.image.pack()
        .pipe(fs.createWriteStream(image.src))
        .on('finish',(function() {
            delete this.piped[image.src];
            console.log("done piping image",image.src);
            if(Object.keys(this.piped).length == 0)
            {
                this.callback()
            }
        }).bind(this,image));
    }
}
ImageStorer.queue = new FileQueue(100000);
ImageStorer.i = 0;
module.exports = ImageStorer;