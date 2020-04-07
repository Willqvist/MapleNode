class InputListener
{
    constructor()
    {
        this.listeners = {};
    }
    listen(name,cb)
    {
        if(!this.listeners[name])
            this.listeners[name] = [];
        this.listeners[name].push(cb);
    }
    recive(name,data) 
    {

        if(!this.listeners[name]) return;
        for (let i = 0; i < this.listeners[name].length; i++)
            this.listeners[name][i](data);
    }
}
InputListener.instance = new InputListener();
module.exports = InputListener.instance;