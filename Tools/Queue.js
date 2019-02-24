class Queue
{
    constructor(callback)
    {
        this.callback = callback;
        this.elements = [];

    }
    push(elem)
    {
        this.elements.push(elem);
        if(this.elements.length == 1)
            this.process();
    }
    process()
    {
        if(this.elements.length==0) return;
        this.callback(this.elements[0],()=>
        {
            this.elements.shift();
            this.process();
        });
    }
}
module.exports = Queue;