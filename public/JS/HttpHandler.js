class HttpHandler
{
    static postData(url,callback)
    {
        let http = new XMLHttpRequest();
        http.open("POST",url.getFullUrl(),true);
        http.setRequestHeader("Content-type", "application/json");
        http.onreadystatechange = function()
        {
            if(http.readyState == XMLHttpRequest.DONE && http.status == 200)
                callback(JSON.parse(http.responseText));
            else if(http.readyState == XMLHttpRequest.DONE && http.status == 404)
                callback({success:false,http:{status:http.status}});
        }
        http.send(JSON.stringify(url.getParamters()));
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
    getParamters()
    {
        return this.parameters;
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
class BarChart
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
        this.bar = 
        {
            width:25,
            color:"red",
            maxHeight:120
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
    getMinMax(data)
    {
        let max = 0;
        let min = 0;
        for(let key in data)
        {
            if(data[key] > max)
                max = data[key];
            if(data[key] < min)
                min = data[key];    
        }
        return {min:min,max:max};
    }
    renderBar(textPosition,data,minMax,maxLineHeight)
    {
        let barRealHeight = (textPosition.y - 20) - maxLineHeight;
        let height = (data/minMax.max)* barRealHeight;
        this.ctx.fillRect(textPosition.x + this.ctx.measureText(textPosition.text).width/2 - this.bar.width/2,textPosition.y - 20,this.bar.width,-height);
    }
    renderChart(data)
    {
        let days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
        let maxLineHeight = 0;
        data = [123,4,234,5344,234,13,2435];
        data = 
        {
            Mon:123,
            Tue:1243,
            Wed:1543,
            Thu:43,
            Fri:5322,
            Sat:122,
            Fri:435,
            Sun:243,
        }
        let minMax = this.getMinMax(data);
        minMax.min = 0;
        this.align({x:this.directions.LEFT,y:this.directions.BOTTOM});
        let paddingX = 50;
        let paddingY = 20;
        let maxWidth = this.canvas.width - paddingX;
        let maxHeight = this.canvas.height - paddingY;
        let scalerX = (maxWidth - paddingX - this.ctx.measureText("Tue").width) / 6;
        let scalerY = (maxHeight - paddingY*3) / 3;
        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgba(32,6,59,1)";
        this.ctx.fillStyle = "#3e78b2";
        //this.ctx.fillRect(50,20,this.canvas.width-70,25+3*scalerY);
        let deltaMinMax = (minMax.max - minMax.min) / 3;
        this.ctx.strokeStyle = "rgba(32,6,59,0.2)";
        for(let i = 0; i <= 3; i++)
        {
            let textPosition = this.getTextPosition(minMax.min + Math.floor(i*deltaMinMax),20,35+i*scalerY);
            this.ctx.fillText(textPosition.text,textPosition.x,textPosition.y-3);
            this.ctx.moveTo(24+ this.ctx.measureText(minMax.max).width,textPosition.y - 6);
            this.ctx.lineTo(this.canvas.width-20,textPosition.y - 6);
            if(i == 3)
                maxLineHeight = textPosition.y - 6;
            //this.ctx.   
        }
        for(let i = 0; i <= 6; i++)
        {
            let textPosition = this.getTextPosition(days[i],40+this.ctx.measureText(minMax.max).width+i*scalerX,20);
            this.ctx.fillText(textPosition.text,textPosition.x,textPosition.y + 4); 
            this.renderBar(textPosition,data[days[i]],minMax,maxLineHeight);  
        }
        this.ctx.stroke();
    }
}
class DOMCompiler
{
    constructor(domString)
    {
        this.domString = domString;
        this.variables = {};
        this.regex = /\{{(.*?)}}/g;
    }
    setVariable({variable = "NULL",data = -1})
    {
        this.variables[variable] = data;
    }
    compileString()
    {
        let data;
        let matches;
        let rawText = this.domString;
        this.domString.replace(this.regex,(g1,g2)=>
        {
            if(this.variables[g2])
                rawText = rawText.replace(g1,this.variables[g2].toString());
        });
        return rawText;
    }
    compileDOM()
    {
        let compiledText = this.compileString();
        let div = document.createElement("div");
        div.innerHTML = compiledText;
        return div.firstChild;
    }
}
class Loader
{
    constructor(id)
    {
        this.loaderElement = document.getElementById(id);
    }
    show()
    {
        this.loaderElement.style.display="flex";
        setTimeout(()=>
        {
            this.loaderElement.style.opacity = "1";
        },10);
    }
    hide()
    {
        this.loaderElement.style.opacity = "0";
        setTimeout(()=>
        {
            this.loaderElement.style.display="none";
        },240);
    }
}
class FormPopup
{
    constructor(name)
    {
        this.fields = {};
        this.inputs = []; 
        this.settings = {};
        this.callback = function(){};
        this.form = document.createElement("form");
        this.form.id = name;
        this.form.className += "popupForm";
        this.isAppended = false;
        this.active = false;
    }
    setCloseable()
    {
        let div = document.createElement("div");
        div.className += "close";
        this.form.appendChild(div);
        let form = this;
        console.log(this);
        div.addEventListener("click",(()=>
        {
            form.hide();
        }).bind(form),false);
    }
    setSetting({name="null",value=-1})
    {
        this.settings[name] = value;
    }
    appendDom(element=document.body)
    {
        if(!this.isAppended)
            element.appendChild(this.form);
        this.isAppended = true;
    }
    show()
    {
        if(!this.isAppended) this.appendDom();
        this.form.style.display="flex";
        this.active = true;
    }
    hide()
    {
        this.form.style.display="none";
        this.active = false;
    }
    isActive()
    {
        return this.active;
    }
    addInput({type="text",id=-1,value=""})
    {
        if(id == -1) return;
        let input = document.createElement("input");
        input.value = value;
        input.id = this.form.id + "_" + id;
        let label = document.createElement("label");
        label.setAttribute("for",input.id);
        input.setAttribute("name",id);
        input.setAttribute("type",type);
        label.innerHTML = id;
        this.inputs.push(input);
        this.form.appendChild(label);
        this.form.appendChild(input);
    }
    getInputByName(name)
    {
        for(let i = 0; i < this.inputs.length; i++)
        {
            if(this.inputs[i].name == name) return this.inputs[i];
        }
        return false;
    }
    setValue({id=-1,value="NULL"})
    {
        let field = this.getInputByName(id);
        if(!field) return;
        field.value = value;
    }
    getFields()
    {
        for(let i = 0; i < this.inputs.length; i++)
        {
            let input = this.inputs[i];
            this.fields[input.name] = input.value;
        }
        return this.fields;
    }
    addElement(element)
    {
        this.form.appendChild(element);
    }
    addButton({type="submit",value="Save"})
    {
        let button = document.createElement("input");
        button.setAttribute("type","button");
        button.value = value;
        this.form.appendChild(button);
        if(type=="submit")
        {
            let self = this;
            button.addEventListener("click",(()=>
            {
                self.callback({settings:this.settings,fields:self.getFields()});
            }).bind(self),false);
        }
    }
    onSubmit(callback)
    {
        this.callback = callback;
    }
}
class InteractiveElement
{
    constructor(element)
    {
        if(!(element instanceof HTMLElement) || element.getAttribute("data-interactiveElement"))
            throw "is not a html element";
    }
}