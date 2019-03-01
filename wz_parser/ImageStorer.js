const fs = require("fs");
class ImageStorer
{
    constructor()
    {
        this.images = [];
        this.hasCallback = false;
        this.callback;
        this.done = false;
        this.isFilling = true;
    }
    addImage(image,dir,src)
    {
        this.done = false;
        this.images.push({image:image,dir:dir,src:src});
        if(this.images.length >= 1)
            this.saveImage();
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
    complete()
    {
        this.isFilling = false;
        this.saveImage();
    }
    saveImage(names)
    {
        if(this.images.length==0)
        {
            if(this.hasCallback && !this.isFilling)
            {
                this.done = true;
                this.callback(names);
            }
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