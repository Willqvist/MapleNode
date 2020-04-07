class Queue
{
    constructor(callback,complete)
    {
        this.callback = callback;
        this.elements = [];
        this.callback_done = complete;
    }
    push(elem)
    {
        this.elements.push(elem);
    }
    process()
    {
        if(this.elements.length==0) return this.callback_done();
        this.callback(this.elements[0],()=>
        {
            this.elements.shift();
            this.process();
        });
    }
}
module.exports = Queue;