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
class AppendableElement
{
    constructor()
    {
        this.isAppended = false;
        this.active = false;
    }
    appendDom(element=document.body)
    {
        if(!this.isAppended)
            element.appendChild(this.element);
        this.isAppended = true;
    }
    show()
    {
        if(!this.isAppended) this.appendDom();
        this.element.style.display="flex";
        this.active = true;
    }
    hide()
    {
        this.element.style.display="none";
        this.active = false;
    }
}
class FormPopup extends AppendableElement
{
    constructor(name)
    {
        super();
        this.fields = {};
        this.inputs = []; 
        this.settings = {};
        this.callback = function(){};
        this.form = document.createElement("form");
        this.element = document.createElement("div");
        this.element.className += "popupWrapper";
        this.element.appendChild(this.form);
        this.form.id = name;
        this.form.className += "popupForm";
        this.formSetting = {};
        this.formSetting.isCloseable = false;
        this.inputMap = {};
    }
    copy(id)
    {
        let form = new FormPopup(id);
        form.fields = this.fields;
        form.inputs = this.inputs;
        form.settings = this.settings;
        form.inputMap = this.inputMap;
        form.formSetting = this.formSetting;
        let clonedElement = this.element.cloneNode(true);
        let clonedForm = this.form.cloneNode(true);
        clonedElement.innerHTML = "";
        clonedElement.appendChild(clonedForm);
        form.submit = this.submit;
        form.inputs = clonedForm.getElementsByTagName("input");
        form.form = clonedForm;
        form.element = clonedElement;
        form.form.id = id;
        return form;
    }
    setCloseable()
    {
        if(this.formSetting.isCloseable)
            this.form.removeChild(this.form.getElementsByClassName("close")[0]);
        let div = document.createElement("div");
        div.className += "close";
        div.appendChild(new DOMCompiler("<svg id=\"icon-cancel\" viewBox=\"0 0 32 32\"><title>cancel</title><path d=\"M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z\"></path></svg>").compileDOM());
        this.form.appendChild(div);
        this.formSetting.isCloseable = true;
        let form = this;
        div.addEventListener("click",(()=>
        {
            form.hide();
        }).bind(form),false);
    }
    setSetting({name="null",value=-1})
    {
        this.settings[name] = value;
    }
    setHeight(height)
    {
        this.form.style.minHeight = height;
    }
    isActive()
    {
        return this.active;
    }
    addColorElement(input)
    {
        let self = this;
        if(!this.colorPicker)
            this.colorPicker = new ColorPicker();
        input.addEventListener("focus",function()
        {
            self.colorPicker.setHex("#FFFFFF");
            let position = input.getBoundingClientRect();
            self.colorPicker.move(position.left,position.top + input.clientHeight + 10);
            if(input.value[0] == '#' && input.value.length >= 2)
            {
                if(!self.colorPicker.isAppended) self.colorPicker.appendDom();
                if(!self.colorPicker.isActive) self.colorPicker.show();
                self.colorPicker.setHex(input.value.repeatLastCharacter(7).toString());
            }  
            self.colorPicker.onSubmit((hex)=>
            {
                input.value = hex;
                self.valueChange(input);
                self.colorPicker.hide();
            });
            input.addEventListener("keyup",function(e)
            {
                if(e.key === "Enter")
                    return self.colorPicker.hide();
                if(input.value[0] == '#' && input.value.length >= 2)
                {
                    if(!self.colorPicker.isActive) self.colorPicker.show();
                    self.colorPicker.setHex(input.value.repeatLastCharacter(7));
                }
                self.valueChange(input);
            },false);
            self.colorPicker.onRevert((hex)=>
            {
                self.colorPicker.hide();
            });
            self.colorPicker.show();
            });
            input.addEventListener("focusout",function()
            {
                //colorPicker.hide();
            },false);

    }
    valueChange(input)
    {
        if(input.valueChangeCallback)
            input.valueChangeCallback(input);
    }
    onInputChange(id,callback)
    {
        this.inputMap[id].valueChangeCallback = callback;
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
        this.inputMap[id] = input;
        this.form.appendChild(label);
        this.form.appendChild(input);

        if(type=="color_custom")
        {
            this.addColorElement(input);
        }
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
    removeElementWithAttribute(attr,value)
    {
        let children = this.form.childNodes;
        for(let i = 0; i < children.length; i++)
        {
            if(children[i].getAttribute(attr) || children[i].getAttribute(attr) === value){
                this.form.removeChild(children[i]);
                return;
            }
        }
    }
    addButton({type="submit",value="Save"})
    {
        let button = document.createElement("input");
        button.setAttribute("type","button");
        button.value = value;
        if(this.submit)
            this.removeElementWithAttribute("data-submit");
        this.form.appendChild(button);
        if(type=="submit")
        {
            let self = this;
            this.submit = button;
            button.setAttribute("data-submit",true); 
            button.addEventListener("click",(()=>
            {
                self.callback({settings:self.settings,fields:self.getFields()});
            }).bind(self),false);
        }
    }
    onSubmit(callback)
    {
        this.callback = callback;
    }
}
FormPopup.FULLSCREEN = "100vh";
FormPopup.BIG = "45em";
FormPopup.NORMAL = "30em";
FormPopup.SMALL = "15em";
class ColorPicker extends AppendableElement
{
    constructor(hex)
    {
        super();
        this.hexValue = hex;
        this.original = "#FFFFFF";
        this.color = {r:255,g: 0,b:0};
        this.thumbPosition = {y:0,normalizedY:0};
        this.submitCallback;
        this.revertCallback;
        this.breakPoints = [];
        this.createElement();
        this.setListeners();
        this.setGradient("rgb(255,0,0)");
        this.addColorBreakPoint({from:{value:0,rgb:{r:255,g:0,b:0}},to:{value:0.1666,rgb:{r:255,g:0,b:255}}});
        this.addColorBreakPoint({from:{value:0.1666,rgb:{r:255,g:0,b:255}},to:{value:0.3332,rgb:{r:0,g:0,b:255}}});
        this.addColorBreakPoint({from:{value:0.3332,rgb:{r:0,g:0,b:255}},to:{value:0.4998,rgb:{r:0,g:255,b:255}}});
        this.addColorBreakPoint({from:{value:0.4998,rgb:{r:0,g:255,b:255}},to:{value:0.6664,rgb:{r:0,g:255,b:0}}});
        this.addColorBreakPoint({from:{value:0.6664,rgb:{r:0,g:255,b:0}},to:{value:0.8333,rgb:{r:255,g:255,b:0}}});
        this.addColorBreakPoint({from:{value:0.8333,rgb:{r:255,g:255,b:0}},to:{value:1.0,rgb:{r:255,g:0,b:0}}});

        this.slider.color = {r:255,g: 0,b:0};
        this.originalHexElement.style.background = hex;
        if(hex)
            this.setHex(hex);


    }
    setHex(hex)
    {
        this.original = hex;
        this.hexValue = this.original;  
        this.originalHexElement.style.background = hex;
        if(this.isAppended)
        {
            let rgb = this.hexToRgb(this.hexValue);
            this.calculatePositionsFromRgb(rgb);
            this.color = rgb;
            this.printColor();
        }   
    }
    appendDom()
    {
        super.appendDom();
        if(this.hexValue)
        {
            let rgb = this.hexToRgb(this.hexValue);
            this.calculatePositionsFromRgb(rgb);
            this.color = rgb;
            this.printColor();
        }
    }
    onSubmit(callback)
    {
        this.submitCallback = callback;
    }
    onRevert(callback)
    {
        this.revertCallback = callback;
    }
    addColorBreakPoint(data)
    {
        this.breakPoints.push(data);
    }
    calculateColorBreakpointValue(position)
    {
        let rgb = this.color;
        for(let i = 0; i < this.breakPoints.length; i++)
        {
            let point = this.breakPoints[i];
            if(this.isBetween(position,point))
            {
                let normalize = (position-point.from.value)/(point.to.value-point.from.value);
                rgb = {r:Math.floor(point.from.rgb.r + normalize*(point.to.rgb.r - point.from.rgb.r)),g:Math.floor(point.from.rgb.g + normalize*(point.to.rgb.g - point.from.rgb.g)),b:Math.floor(point.from.rgb.b + normalize*(point.to.rgb.b - point.from.rgb.b))};
                break;
            }
        }
        return rgb;
    }
    calculatePositionBreakpointValue(color)
    {
        for(let i = 0; i < this.breakPoints.length; i++)
        {
            let affectedColor = null;
            let point = this.breakPoints[i];
            affectedColor = this.isBetweenColor(color,point);
            if(affectedColor)
            {
                let delta = 0;
                if(point.from.rgb[affectedColor.key] - point.to.rgb[affectedColor.key] < 0)
                    delta = -(affectedColor.value/255)+1;
                else
                    delta = affectedColor.value/255;
                let position = (point.from.value - delta*(point.to.value-point.from.value)) * this.slider.clientHeight;
                return position;
            }
        }
    }
    setThumbPosition(object,position)
    {
        object.thumb.style.transform="translate("+ position.x +"px,"+ position.y +"px)";
    }
    move(x,y)
    {
        console.log("wew");
        this.element.style.left = x+"px";
        this.element.style.top = y+"px";
    }
    calculatePositionsFromRgb(rgb)
    {
        console.log("WEW",rgb);
        let minMax = this.getMinMax(rgb.r,rgb.g,rgb.b);
        this.ranger.thumb.position.y = minMax.max;
        this.ranger.thumb.position.x = minMax.max;
        let position = {};
        let normalizedPosition = {};
        let thumbHalf = this.ranger.thumb.clientWidth / 2;
        position.x = ((minMax.max-minMax.min)/minMax.max) * this.ranger.clientWidth - thumbHalf;
        position.y = ((255-minMax.max) / 255) * this.ranger.clientHeight - thumbHalf;

        normalizedPosition.x = (position.x + thumbHalf) / this.ranger.clientWidth;
        normalizedPosition.y = (position.y + thumbHalf) / this.ranger.clientHeight;

        let flippedNormalizedPosition = {x:-normalizedPosition.x + 1,y:-normalizedPosition.y + 1};
        let fnp = flippedNormalizedPosition;
        let color = {r:0,g:0,b:0};
        color.r = Math.floor((rgb.r - 255*fnp.x*fnp.y)/(-fnp.x*fnp.y + fnp.y)).clamp(0,255);
        color.g = Math.floor((rgb.g - 255*fnp.x*fnp.y)/(-fnp.x*fnp.y + fnp.y)).clamp(0,255);
        color.b = Math.floor((rgb.b - 255*fnp.x*fnp.y)/(-fnp.x*fnp.y + fnp.y)).clamp(0,255);
        if(color.r == 1) color.r = 0;
        if(color.r == 254) color.r = 255;
        if(color.g == 1) color.g = 0;
        if(color.g == 254) color.g = 255;
        if(color.b == 1) color.b = 0;
        if(color.b == 254) color.b = 255;
        let sliderPosition = this.calculatePositionBreakpointValue(color);
        this.setThumbPosition(this.ranger,position);
        this.setThumbPosition(this.slider,{x:0,y:sliderPosition-thumbHalf});
        if(rgb.r == rgb.g && rgb.g == rgb.b)
            color = {r:255,g:0,b:0};
        this.setGradient(this.rgbToString(color));
        this.slider.color = color;
        this.ranger.thumb.normalizedPosition = normalizedPosition;
    }
    getMinMax(...values)
    {
        let max = values[0];
        let min = values[0];
        for(let i = 1; i < values.length; i++)
        {
            if(values[i] > max)
                max = values[i];
            if(values[i] < min)
                min = values[i]; 
        }
        return {min:min,max:max};
    }
    calculateColorRangerValue(ranger)
    {
        let sliderColor = this.slider.color;
        let position = {x:ranger.thumb.normalizedPosition.x,y:ranger.thumb.normalizedPosition.y};
        position.x = (position.x*-1) + 1;
        position.y = (position.y*-1) + 1;
        let color = {r:0,g:0,b:0};
        color.r = (255*position.x + (-position.x + 1)*sliderColor.r)*position.y;
        color.g = (255*position.x + (-position.x + 1)*sliderColor.g)*position.y;
        color.b = (255*position.x + (-position.x + 1)*sliderColor.b)*position.y;
        return {r:Math.floor(color.r),g:Math.floor(color.g),b:Math.floor(color.b)};
    }
    rgbToString(rgb)
    {
        return "rgb("+rgb.r+","+rgb.g+","+rgb.b+")";
    }
    rgbToHex(rgb)
    {
        return "#" + this.componentToHex(rgb.r) + this.componentToHex(rgb.g) + this.componentToHex(rgb.b);
    }
    hexToRgb(hex)
    {
        hex = hex.replace("#","");
        let color = {};
        color.r = parseInt(hex.substring(0,2),16);
        color.g = parseInt(hex.substring(2,4),16);
        color.b = parseInt(hex.substring(4,6),16);
        return color;
    }
    componentToHex(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    isBetween(value,breakPoint)
    {
        return(value >= breakPoint.from.value && value < breakPoint.to.value);
    }
    isBetweenColor(color,breakpoint)
    {
        if(color.r != 0 && color.r != 255)
        {
            if (breakpoint.from.rgb.g == breakpoint.to.rgb.g && breakpoint.from.rgb.b == breakpoint.to.rgb.b && color.b == breakpoint.from.rgb.b && color.g == breakpoint.from.rgb.g)
                return {value:color.r,key:"r"};
        }
        else if(color.g != 0 && color.g != 255)
        {
            if (breakpoint.from.rgb.r == breakpoint.to.rgb.r && breakpoint.from.rgb.b == breakpoint.to.rgb.b && color.r == breakpoint.from.rgb.r && color.b == breakpoint.from.rgb.b)
                return {value:color.g,key:"g"};
        }
        else if(color.b != 0 && color.b != 255)
        {
            if (breakpoint.from.rgb.g == breakpoint.to.rgb.g && breakpoint.from.rgb.r == breakpoint.to.rgb.r && color.r == breakpoint.from.rgb.r && color.g == breakpoint.from.rgb.g)
                return {value:color.b,key:"b"};
        }
        //if(color.r != 0 ||color.r != 255)
        //console.log(color.r == breakpoint.from.rgb.r && color.r == breakpoint.to.rgb.r);
        //console.log(color.g == breakpoint.from.rgb.g && color.g == breakpoint.to.rgb.g);
        //console.log(color.b == breakpoint.from.rgb.b && color.b == breakpoint.to.rgb.b);
        return null;
    }
    createElement()
    {
        let element = new DOMCompiler("<div class=\"colorPicker\"><div class=\"colorRangeWrapper\"><div class=\"colorRangeThumb\"></div><canvas class=\"colorRange\"></canvas><div class=\"newHex color\"></div><div class=\"originalHex color\"></div></div><div class=\"colorSlider\"><div class=\"colorSliderThumb\"></div></div><div class=\"hexValue noSelect\"><span>#FFFFF</span></div><div class=\"btnHolder\"><div class=\"btn noSelect btnSubmit\"><span>Apply</span></div><div class=\"btn noSelect revert\"><span>Revert</span></div></div></div>").compileDOM();
        this.element = element;
        this.ranger = element.getElementsByClassName("colorRange")[0];
        this.ranger.wrapper = element.getElementsByClassName("colorRangeWrapper")[0];
        this.ranger.thumb = element.getElementsByClassName("colorRangeThumb")[0];
        this.ranger.canvas = this.ranger.getContext("2d");
        this.slider = element.getElementsByClassName("colorSlider")[0];
        this.slider.thumb = this.slider.getElementsByClassName("colorSliderThumb")[0];
        this.hex = element.getElementsByClassName("hexValue")[0];
        this.originalHexElement = element.getElementsByClassName("originalHex")[0];
        this.newHexElement = element.getElementsByClassName("newHex")[0];
        this.slider.thumb.position = {y:0};
        this.slider.thumb.normalizedPosition = {y:0};
        this.ranger.thumb.position = {x:255,y:255};
        this.ranger.thumb.normalizedPosition = {x:1,y:1};
        this.submit = element.getElementsByClassName("btnSubmit")[0];
        this.revert = element.getElementsByClassName("revert")[0];
        this.slider.move = false;
        this.ranger.move = false;


    }
    setGradient(color)
    {
        let grd = this.ranger.canvas.createLinearGradient(0,this.ranger.height,0,0);
        grd.addColorStop(0,"black");
        grd.addColorStop(1,"transparent");
        let grd2 = this.ranger.canvas.createLinearGradient(0,0,this.ranger.width,0);
        grd2.addColorStop(0,"white");
        grd2.addColorStop(1,color);
        this.ranger.canvas.fillStyle=grd2;
        this.ranger.canvas.fillRect(0,0,this.ranger.width,this.ranger.height);
        this.ranger.canvas.fillStyle=grd;
        this.ranger.canvas.fillRect(0,0,this.ranger.width,this.ranger.height);
    }
    mouseSliderMove(element,e)
    {
        let position = element.getBoundingClientRect();
        let thumbCenter = this.slider.thumb.clientHeight /2;
        let yPos = (e.clientY - position.top - thumbCenter).clamp(-thumbCenter,this.slider.clientHeight-thumbCenter);
        this.slider.thumb.position.y = yPos+thumbCenter;
        this.slider.thumb.normalizedPosition.y = (yPos+thumbCenter) / this.slider.clientHeight;
        this.slider.color = this.calculateColorBreakpointValue(this.slider.thumb.normalizedPosition.y);
        this.color = this.calculateColorRangerValue(this.ranger);
        this.setGradient(this.rgbToString(this.slider.color));
        this.setThumbPosition(this.slider,{x:0,y:yPos});
        this.printColor();
    }
    mouseRangerMove(element,e)
    {
        let position = element.getBoundingClientRect();
        let thumbCenterY = this.ranger.thumb.clientHeight / 2;
        let thumbCenterX = this.ranger.thumb.clientWidth / 2;
        let yPos = (e.clientY - position.top - thumbCenterY).clamp(-thumbCenterY,this.ranger.clientHeight-thumbCenterY);
        let xPos = (e.clientX - position.left - thumbCenterX).clamp(-thumbCenterX,this.ranger.clientWidth-thumbCenterX);
        this.ranger.thumb.position = {x:xPos+thumbCenterX,y:yPos+thumbCenterY};
        this.ranger.thumb.normalizedPosition = {x:(xPos+thumbCenterX)/this.ranger.clientWidth,y:(yPos+thumbCenterY)/this.ranger.clientHeight};
        this.color = this.calculateColorRangerValue(this.ranger);
        this.setThumbPosition(this.ranger,{x:xPos,y:yPos});
        this.printColor();
    }
    printColor(color=this.color)
    {
        let hex = this.rgbToHex(color);
        this.hex.innerHTML = this.rgbToHex(color);
        this.hex.style.boxShadow = "0px 1px 0px" + hex;
        this.newHexElement.style.background = hex;
    }
    setListeners()
    {
        let self = this;
        document.onmousemove = function(e)
        {
            if(self.slider.move)
                self.mouseSliderMove(self.slider,e);
            else if(self.ranger.move)
                self.mouseRangerMove(self.ranger.wrapper,e);
        }
        this.slider.addEventListener("mousedown",function(e)
        {
            this.move = true;
        },false);

        this.ranger.wrapper.addEventListener("mousedown",function(e)
        {
            self.ranger.move = true;
        },false);
        document.addEventListener("mouseup",function()
        {
            self.slider.move = false;
            self.ranger.move = false;
        });
        this.submit.addEventListener("click",()=>
        {
            self.submitCallback(this.rgbToHex(this.color));
        },false);
        this.revert.addEventListener("click",()=>
        {
            self.revertCallback();
        },false);
    }
}

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};
String.prototype.repeatLastCharacter = function(length)
{
    let times = length - this.length;
    if(times <= 0) return this;
    let string = this + this.slice(-1).repeat(times);
    return string;
}