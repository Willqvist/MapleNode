export default class InputListener
{

    static instance : InputListener = new InputListener();
    listeners : any;
    constructor()
    {
        this.listeners = {};
    }

    /**
     * listens to input from the stdin.
     * @param name the string to match to
     * @param cb the callback when {name} ahs been written.
     */
    static listen(name : string|string[],cb : (any)=>void)
    {
        if(!(name instanceof Array)) {

            this.instance.listen(<string>name,cb);
        } else {
            let names = <string[]> name;
            for(let i = 0; i < names.length; i++) {
                this.instance.listen(names[i], cb);
            }
        }
    }


    /**
     * executes all listeners that is listening to {name}
     * @param name the name of the listeners to execute.
     * @param data data to send to all listeners.
     */
    static recive(name : string,data : any) : boolean
    {
        return this.instance.recive(name,data);
    }

    private listen(name : string,cb : (any)=>void)
    {
        if(!this.listeners[name])
            this.listeners[name] = [];
        this.listeners[name].push(cb);
    }
    private recive(name : string,data : any) : boolean
    {

        if(!this.listeners[name]) return false;
        for (let i = 0; i < this.listeners[name].length; i++)
            this.listeners[name][i](data);

        return true;
    }
}
