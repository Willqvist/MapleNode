class CallbackArray
{
    constructor(arr)
    {
        this.index = 0;
        this.array = arr;
    }
    forEach(callback)
    {
        console.log(this.index,this.array.length);
        if(callback && !callback.stop)
            this.callback = callback;
        
        if(this.array.length == 0 || this.index >= this.array.length || (callback && callback.stop))
            return this.callback(null,null,true);
        this.callback(this.array[this.index++],((res)=>
        {
            this.forEach(res);
        }).bind(this),false);
    }
}
module.exports = CallbackArray;