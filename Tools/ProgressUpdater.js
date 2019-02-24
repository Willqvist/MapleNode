class ProgressUpdater
{
    init(io)
    {
        this.io = io;
        this.wait = [];
        this.busy = false;
        this.progress = 0;
        this.io.on('connection',(socket)=>
        {
            console.log("connection");
            socket.on('progress connect',(data)=>
            {
                console.log("wew");
                if(this.busy)
                {
                    this.wait.push(socket);
                    socket.emit('busy',{}); 
                    return;
                }
                this.updater = socket;

                this.busy = true;
            });

            socket.on('disconnect',()=>
            {
                this.goToNext();
            });
        });
    }
    goToNext()
    {
        this.progress = 0;
        if(this.wait.length <= 0)
        {
            this.busy = false;
            return;
        }
        let obj = this.wait.pop();
        this.updater = obj;
        this.updater.emit('turn',{});
    }
    sendError(err)
    {
        console.log(err);
        if(!this.updater) return;
        this.progress = 0;
        this.updater.emit('error uploader',err);
    }
    updateProgress(name,progress)
    {
        if(!this.updater) return;
        this.progress += progress;
        this.updater.emit('progress update',{name:name,progress:this.progress});
    }
    progressComplete(name)
    {
        if(!this.updater) return;
        this.updater.emit('progress complete',100);
        this.goToNext();
    }
}
const updater = new ProgressUpdater();
module.exports = updater;