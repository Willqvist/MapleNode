const fs = require("fs");
class ImageStorer
{
    constructor()
    {
        this.images = [];
        this.hasCallback = false;
        this.callback;
        this.done = false;
    }
    addImage(image,dir,src)
    {
        this.done = false;
        this.images.push({image:image,dir:dir,src:src});
        if(this.images.length == 1)
            this.saveImage();
    }
    static getInstance()
    {
        if(!ImageStorer.instance)
            ImageStorer.instance = new ImageStorer();
        
        return ImageStorer.instance;
    }
    setCallbackComplete(callback)
    {
        this.hasCallback = true;
        this.callback = callback;
        if(this.done)
        {
            callback();
        }
    }
    saveImage(names)
    {
        if(this.images.length==0)
        {
            if(this.hasCallback)
            {
                this.callback(names);
            }
            this.done = true;
            return;
        }
        let image = this.images[0];
        if(!fs.existsSync(image.dir))
            fs.mkdirSync(image.dir);
        
        image.image.pack()
        .pipe(fs.createWriteStream(image.src))
        .on('finish',(function() {
            this.images.shift();
            this.saveImage();
        }).bind(this));
    }
}
module.exports = ImageStorer;