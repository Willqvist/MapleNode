class HttpHandler
{
    static postData(url,callback)
    {
        let http = new XMLHttpRequest();
        http.open("POST",url.getFullUrl(),true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.onreadystatechange = function()
        {
            if(http.readyState == XMLHttpRequest.DONE && http.status == 200)
                callback(JSON.parse(http.responseText));
            else if(http.readyState == XMLHttpRequest.DONE && http.status == 404)
                callback({success:false,http:{status:http.status}});
        }
        http.send(url.parametersToString());
    }
}
class Url
{
    constructor(url,parameters)
    {
        this.url = url;
        this.parameters = parameters;
    }
    getFullUrl()
    {
        return this.url;
    }
    parametersToString()
    {
        let parsedParameter = "";
        for(let key in this.parameters)
            parsedParameter += key + "=" + this.parameters[key] + "&";
        return parsedParameter.slice(0,-1);
    }
}
class FormElement
{
    constructor(id)
    {
        this.formElement = document.getElementById(id);
        this.fields = this.formElement.getElementsByTagName("input");
    }
    getInputValues()
    {
        let data = {};
        for(let i = 0; i < this.fields.length; i++)
            data[this.fields[i].name] = this.fields[i].value;
        return data;  
    }
    onSubmit(settings, callback)
    {
        this.formElement.onsubmit = (function(e)
        {
            if(settings.preventDefault)
                e.preventDefault();
            if(settings.body)    
                return callback(form.getInputValues(),e);
            return callback(e);  
        }).bind({form:this});
    }
}
class ErrorElement
{
    constructor(id)
    {
        this.errorElement = document.getElementById(id);
        this.isShown = false;
    }
    removeError()
    {
        this.errorElement.style.display = "none";
    }
    success(success)
    {
        this.errorElement.innerHTML = success.reason;
        this.errorElement.style.display = "block";
        this.errorElement.style.background = "#69dc9e";
        this.isShown = true;
    }
    showError(error)
    {
        this.errorElement.innerHTML = error.reason;
        this.errorElement.style.display = "block";
        this.errorElement.style.background = "#CC3363";
        this.isShown = true;
    }
    isErrorShown()
    {
        return this.isShown;
    }
}
class LineChart
{
    constructor(canvasID,xData,yData)
    {
        this.canvas = document.getElementById(canvasID);
        this.ctx = this.canvas.getContext("2d");
        this.size = this.canvas.getBoundingClientRect();
        this.alignment ={x:0,y:0};
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.directions = 
        {
            TOP:0,
            LEFT:0,
            RIGHT:this.canvas.width,
            BOTTOM:this.canvas.height, 
        }

    }
    getPosition(x,y)
    {
        let direction = {x:1,y:1};
        if(this.alignment.x == this.directions.RIGHT)
        direction.x = -1;
        if(this.alignment.y == this.directions.BOTTOM)
        direction.y = -1;
        return {x:this.alignment.x + x*direction.x,y:this.alignment.y + y*direction.y};
    }
    getTextPosition(text,x,y)
    {
        let dimensions = this.ctx.measureText(text);
        console.log(dimensions);
        let position = this.getPosition(x,y);
        if(this.alignment.x == this.directions.RIGHT)
        position.x -= dimensions.width;
        return {text:text,width:dimensions.width,x:position.x,y:position.y};
    }
    align(alignment)
    {
        this.alignment.x = alignment.x;
        this.alignment.y = alignment.y;
    }
    setFont(fontInfo)
    {
        this.ctx.font = fontInfo.size + " " + fontInfo.font;
    }
    setupChart()
    {
        this.align({x:this.directions.LEFT,y:this.directions.BOTTOM});
        let padding = 20;
        let max = this.canvas.width - padding;
        let scaler = (max - padding - this.ctx.measureText("wew5").width) / 4;
        for(let i = 0; i < 5; i++)
        {
            let textPosition = this.getTextPosition("wewi",20+i*scaler,20);
            this.ctx.fillText(textPosition.text,textPosition.x,textPosition.y);   
        }
    }
}