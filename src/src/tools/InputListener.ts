export default class InputListener
{

    static instance : InputListener = new InputListener();
    listeners : any;
    constructor()
    {
        this.listeners = {};
    }

    static listen(name : string,cb : (any)=>void)
    {
        this.instance.listen(name,cb);
    }
    static recive(name : string,data : any)
    {
        this.instance.recive(name,data);
    }

    private listen(name : string,cb : (any)=>void)
    {
        if(!this.listeners[name])
            this.listeners[name] = [];
        this.listeners[name].push(cb);
    }
    private recive(name : string,data : any)
    {

        if(!this.listeners[name]) return;
        for (let i = 0; i < this.listeners[name].length; i++)
            this.listeners[name][i](data);
    }
}
