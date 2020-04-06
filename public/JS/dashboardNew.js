

/*---------------------------------------------PANELS-------------------------------------------------*/


class PanelHandler {
    constructor() {
        this.panels = {};
        this.activePanel = null;
        this.menu = null;
    }

    addPanel(panel) {
        this.panels[panel.id] = panel;
        panel.init();
    }

    goTo(id) {
        if(this.menu) {

            this.menu[id].icon.className = "fas fa-circle-notch fa-spin";
        }
        if(this.activePanel != null) {
            this.activePanel.DOM.style.display="none";
            let old = this.activePanel;
            this.activePanel = this.panels[id];
            old.onExit().then( r => {
                this.activePanel.onFocus().then(_ => {
                    this.activePanel.DOM.style.display="flex";
                    if(this.menu) {
                        this.menu[id].icon.className = this.menu[id].className;
                    }
                });
            }
            );
        } else {
            this.activePanel = this.panels[id];
            this.activePanel.onFocus().then(_ => {
                this.activePanel.DOM.style.display="flex";
                if(this.menu) {
                    this.menu[id].icon.className = this.menu[id].className;
                }
            });
        }
    }

    bindMenu(menu) {
        let lis = menu.getElementsByTagName("li");
        this.menu = {};
        for(let i = 0; i < lis.length; i++) {
            let page = lis[i].getAttribute("page");
            let icon = lis[i].getElementsByTagName('i')[0];
            this.menu[page] = {
                DOM:lis[i],
                icon:icon,
                className:icon.className
            };
            console.log(this.menu[page]);
            lis[i].addEventListener("click",()=> {
                this.goTo(page);
            },false);
        }
    }

}


/*---------------------------------------------------------------------------------------------------*/


class Panel {
    constructor(id) {
        this.id = id;
        this.DOM = document.getElementById(id);
        this.popups = {};
    }

    registerTriggers() {
        let cls = this.DOM.getElementsByClassName("popup-trigger");
        for(let i = 0; i < cls.length; i++) {
            let popup = PopupProvider.get(cls[i].getAttribute("trigger"));
            popup.bindButton(cls[i],this.onPopupClick);
        }
    }
    
    get(id) {
        return document.getElementById(id);
    }

    getAll(cls) {
        return this.DOM.getElementsByClassName(cls);
    }

    async onPopupClick(state,data){}

    init(){}
    async onFocus(){}
    async onData(data){}
    async onExit(){}

}


/*---------------------------------------------------------------------------------------------------*/


class StatisticsPanel extends Panel {
    init() {
        super.init();
        console.log("init");
    }

    async onPopupClick(state,data) {
        super.onPopupClick(state,data);
        console.log("click: ", state);
    }

    async onExit() {
        super.onExit();

    }

    async onFocus() {
        super.onFocus();
        console.log("focusing");
    }
}


/*---------------------------------------------------------------------------------------------------*/


class DownloadPanel extends Panel {

    init() {
        let remove = PopupProvider.get("removePopup");
        remove.bindButton(this.getAll("remove"),this.onRemoveDownload);
        super.init();
    }

    async onRemoveDownload(state,data) {
        if(state == PopupForm.RESULT && !data.close) {
            console.log("remove data: ", data);
            let url = new Url("./dashboard/download/remove",{
                id:data.id,
            });
            let response = await HttpHandler.postData(url);
            return {error:response.reason};
        }
        return {error:false};
    }

    async onPopupClick(state,data) {
        super.onPopupClick(state,data);
        if(state == PopupForm.RESULT && !data.close) {
            if(data.input_1.length == 0 || data.input_2.length == 0) {
                return {error:"Please fill in all the fields!"};
            }
            let url;
            if(data.id == -1) {
                url = new Url("./dashboard/download/add",{
                    name:data.input_1,
                    url:data.input_2
                });
            } else {
                url = new Url("./dashboard/download/update",{
                    key:data.id,
                    name:data.input_1,
                    url:data.input_2
                });
            }
            let response = await HttpHandler.postData(url);
            return {error:response.reason};
        }
        return {error:false};
    }

    async onExit() {
        //let dat = await Dialog.showYesNo("Are you sure?");
        super.onExit();
    }

    async onFocus() {
        super.onFocus();
    }

}


/*---------------------------------------------------------------------------------------------------*/


class VotePanel extends Panel {

    init() {
        let remove = PopupProvider.get("removePopup");
        remove.bindButton(this.getAll("remove"),this.onRemoveVote);
    }

    async onRemoveVote(state,data) {
        if(state == PopupForm.RESULT && !data.close) {
            console.log("remove data: ", data);
            let url = new Url("./dashboard/vote/remove",{
                id:data.id,
            });
            let response = await HttpHandler.postData(url);
            return {error:response.reason};
        }
        return {error:false};
    }

    async onPopupClick(state,data) {
        if(state == PopupForm.RESULT && !data.close) {
            if(data.input_1.length == 0 || data.input_2.length == 0) {
                return {error:"Please fill in all the fields!"};
            }
            let url;
            console.log(data);
            if(data.id == -1) {
                url = new Url("./dashboard/vote/add",{
                    name:data.input_1,
                    url:data.input_2,
                    nx:data.input_3,
                    time:data.input_4
                });
            } else {
                url = new Url("./dashboard/vote/update",{
                    key:data.id,
                    name:data.input_1,
                    url:data.input_2,
                    nx:data.input_3,
                    time:data.input_4
                });
            }
            let response = await HttpHandler.postData(url);
            return {error:response.reason};
        }
        return {error:false};
    }

    async onExit() {
        super.onExit();
    }

    async onFocus() {
        super.onFocus();
    }

}


/*---------------------------------------------TOOLS--------------------------------------------------*/


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/*---------------------------------------------POPUP--------------------------------------------------*/


class PopupProvider {

    static get(id) {
        if(!PopupProvider.popups[id]) {
            PopupProvider.popups[id] = new PopupForm(id);
        }
        return PopupProvider.popups[id];
    }

}
PopupProvider.popups = {};
PopupProvider.instances = 0;

/*---------------------------------------------------------------------------------------------------*/


class PopupForm {
    constructor(id) {
        this.id = id;
        this.visible = false;
        this.parsedData = {};
        this.DOM = document.getElementById(id);
        this.title = this.DOM.getElementsByClassName("title")[0];
        this.error = this.DOM.getElementsByClassName("error_popup")[0];
        this.parent = this.DOM.parentElement;
        if(!this.DOM.className.includes("popup") || !this.parent.className.includes("popups")) {
            throw "DOM object does not contain popup classname";
        }
        this.form = this.DOM.getElementsByTagName("form")[0];
        this.fields = this.form.querySelectorAll("input,select,textarea");

        this.form.onsubmit = e => {
            e.preventDefault();
        };

        this.close = this.DOM.getElementsByClassName("close")[0];
        this.initAttributes();

        document.addEventListener("keyup",(e)=> {
            if(e.key === "Escape" && this.visible) {
                this.fieldResolve({close:true});
                this.fieldResolve = null;
            }
        },false);

    }

    initAttributes() {
        this.attribs = {};
        let atcls = this.DOM.getElementsByClassName("attrib");
        for(let i = 0; i < atcls.length; i++) {
            this.attribs[atcls[i].getAttribute("name")] = atcls[i];
        }
    }

    async animateIn() {
        if(this.visible) return;
        this.visible= true;
        this.parent.style.display="flex";
        this.DOM.style.display="block";
        await sleep(1);
        this.DOM.style.transform="scale(1)";
        this.parent.style.opacity = "1";
        this.DOM.style.opacity = "1";
    }

    async animateOut() {
        if(!this.visible) return;
        this.visible= false;
        this.parent.style.opacity = "0";
        this.DOM.style.opacity="0";
        this.DOM.style.transform="scale(0.9)";
        await sleep(220);
        this.parent.style.display = "none";
        this.DOM.style.display = "none";
        this.DOM.style.transform="scale(1.1)";
    }

    async show(elem,clb) {
        this.animateIn();
        let data = await this.getFields();
        this.fieldResolve = null;
        let submitText = this.title.textContent;
        this.title.innerHTML += "<i class=\"fas fa-circle-notch fa-spin\"></i>";
        let parsed = data;
        if(!data.close) {
            parsed = await this.parseData(data.parse);
            parsed.close = data.close;
        }

        let res = await clb(PopupForm.RESULT, parsed);
        this.title.innerHTML = submitText;
        if(res.error) {
            this.showError(res.error);
            return this.show(elem,clb);
        }
        if(!data.close) {
            this.fillBindedData(
                elem.getAttribute("popup-id"),
                this.parsedData[elem.getAttribute("popup-id")]);
        }
        this.hideError();
        this.animateOut();
        return parsed;
    }

    showError(msg) {
        console.log("showing error!");
        this.error.innerHTML = msg;
        this.error.style.opacity="1";
        this.error.style.marginBottom="2rem";
        this.error.style.padding="1rem 1rem";
        this.error.style.height="auto";
    }

    hideError() {
        this.error.style.opacity="0";
        this.error.style.marginBottom="0rem";
        this.error.style.padding="0rem 1rem";
        this.error.style.height="0";
    }

    async parseData(data) {
        let obj = {};
        for(let i = 0; i < data.length; i++) {
            obj[data[i].getAttribute("name")] = data[i].value;
        }
        return obj;
    }

    getFields() {
        return new Promise(resolve => {
            this.fieldResolve = resolve;
            this.form.onsubmit = e => {
                e.preventDefault();
                resolve({close:false,parse:this.fields});
            };
            if(this.close) {
                this.close.addEventListener("click",e=>{
                    resolve({close:true});
                },false);
            }
        })
    }

    bindAttribToDOM(attribs) {
        if(!attribs) return;
        for(let key in attribs) {
            if(key==="nodes") continue;
            let dom = this.attribs[key];
            if(!dom) continue;
            if(dom.tagName === 'INPUT') {
                dom.value = attribs[key];
            } else {
                dom.innerHTML = attribs[key];
            }
        }
    }

    fillBindedData(id,attribs) {
        if(!attribs) return;
        for(let key in attribs) {
            if(key==="nodes") continue;
            let elem  = attribs.nodes[key];
            if(elem) {
                elem.innerHTML = this.attribs[key].value;
                this.parsedData[id][key] = this.attribs[key].value;
            }
        }
    }


    bindEventListener(elem,clb) {
        if(elem.hasAttribute("popup-data")) {
            let bind = AttributeParser.parse(elem,elem.getAttribute("popup-data"));
            console.log(bind);
            elem.setAttribute("popup-id",bind.id);
            this.parsedData[bind.id] = bind.data;
        }

        elem.addEventListener("click", ((e) => {
            clb(PopupForm.CLICK, e).then((res)=> {
                if(res.error) {
                    this.showError(res.error);
                }
                this.bindAttribToDOM(this.parsedData[elem.getAttribute("popup-id")]);
                this.show(elem,clb).then(res => {});
            });
        }).bind(clb), false);
    }

    bindButton(btn,clb) {
        if(btn instanceof HTMLCollection) {
            for(let i = 0; i < btn.length; i++) {
                this.bindEventListener(btn[i],clb);
            }
        }else {
           this.bindEventListener(btn,clb);
        }
    }

}



/*---------------------------------------------------------------------------------------------------*/



class AttributeParser {
    static parse(focused,str) {
        return AttributeParser.parseAttrib(focused,str,0);
    }
    static parseAttrib(node,str, start) {
        str = str.replace(/  |\r\n|\n|\r/gm, '');
        let org = node;
        str += "!";
        let data = {};
        let buffer = [300];
        let bufferSize = 0;
        let state = null;
        let prevState = null;
        let changedState = false;
        let values = [];
        let renames = [];
        let nodes = [];
        for(let i = start; i < str.length; i++) {
            let chr = str.charAt(i);
            switch(chr) {
                case '<' : node = node.parentNode; continue;
                case '>' : changedState=true;state=STATES.CHILD; continue;
                case '.' : changedState=true;state=STATES.ATTRIBUTE; continue;
                case '=' : changedState=true;state=STATES.RENAME; continue;
                case '#' : changedState=true;state=STATES.CONST; continue;
                case '!' : changedState=true;state=STATES.END; break;
                case ',' : {node = org;} continue;
            }
            if (prevState != null && changedState) {
                let newStr = buffer.slice(0, bufferSize).join("");
                switch(prevState) {
                    case STATES.ATTRIBUTE:{
                        if(state == STATES.ATTRIBUTE) {
                            console.error("[ILLEGAL STATE] Can not have two attributes after eachother");
                            return {end:-1,data:{}};
                        }
                        if(state == STATES.CHILD) {
                            console.error("[ILLEGAL STATE] Can not have child after attribute");
                            return {end:-1,data:{}};
                        }
                        values.push(node.getAttribute(newStr));
                        nodes.push(null);
                    } break;
                    case STATES.RENAME:renames.push(newStr); break;
                    case STATES.CHILD:{
                        node = AttributeParser.findChild(node,newStr);
                        if(state != STATES.ATTRIBUTE && state != STATES.CHILD) {
                            values.push(node.textContent);
                            nodes.push(node);
                        }
                    }break;
                    case STATES.CONST:values.push(newStr);nodes.push(null);break;
                }
                bufferSize = 0;
            }
            buffer[bufferSize++] = chr;
            changedState=false;
            prevState=state;
        }
        return {
            end:str.length,
            id:AttributeParser.count++,
            data:AttributeParser.toObject(values,renames,nodes)};
    }
    static toObject(values,renames,nodes) {
        let obj = {};
        obj.nodes = {};
        for(let i = 0; i < values.length; i++) {
            if(i < renames.length) {
                obj[renames[i]] = values[i];
                if(nodes[i])
                    obj.nodes[renames[i]] = nodes[i];
            } else {
                obj[values[i].toString()] = values[i];
                if(nodes[i])
                    obj.nodes[nodes[i].toString()] = nodes[i];
            }
        }
        return obj;
    }
    static findChild(root,str) {
        let num = 0;
        if(str.slice(-1) == ']') {
            let i = str.indexOf('[');
            num = parseInt(str.substring(i+1,str.length-1));
            str = str.substring(0,i);
        }
        return root.getElementsByTagName(str)[num];
    }
}
AttributeParser.count = 0;
const STATES = {
    CHILD:0,RENAME:1,END:2,NONE:3,ATTRIBUTE:3,END:4,CONST:5
}
PopupForm.CLICK = 0;
PopupForm.RESULT = 1;
