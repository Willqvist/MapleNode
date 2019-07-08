class Panel
{
    constructor(name,settings)
    {
        this.name = name;
        this.element = document.getElementById(name);

        this.elements = {};
        this.active = false;
        this.transition = new PanelTranslate();
        this.hideTimeout;
        this.showTimeout;

        if(settings)
        {
            this.loadable = settings.loadable;
        }

    }
    setMenuItem(item)
    {
        let icon = item.getElementsByTagName("i")[0];
        this.menuIcon = {icon:icon,class:icon.className};
    }
    show()
    {
        if(this.loadable)
        {
            this.menuIcon.icon.className = "fas fa-circle-notch fa-spin";
        }
        this.onShow(()=>
        {
            if(this.loadable)
                this.menuIcon.icon.className = this.menuIcon.class;
            this.element.style.zIndex="5";
            if(this.hideTimeout)
                clearTimeout(this.hideTimeout);
            this.element.style.display="block";
            this.showTimeout = setTimeout(() => {
                this.transition.start(this.element);
                if(!this.loaded)
                {
                    this.loaded=true;
                    this.init();
                }
                this.visible();
            }, 20);
        });
    }
    visible(){}
    hide()
    {
        if(this.showTimeout)
            clearTimeout(this.showTimeout);
            this.element.style.zIndex="1";
        this.transition.stop(this.element);
        this.onHide();
        this.hideTimeout = setTimeout(() => {
            this.element.style.display="none";
            this.transition.reset(this.element);
        }, 400);
    }
    onShow(show){show();}
    onHide(){}
    init(){}
    getHeader()
    {
        return this.element.getElementsByClassName("panelHeader")[0];
    }
    onClick(btn,callback)
    {
        if(!this.elements[btn])
            this.elements[btn] = this.element.getElementsByClassName(btn)[0];
        this.elements[btn].addEventListener("click",callback,false);
    }
    forEachElement(cls,callback,parent=this.element)
    {
        let elems = parent.getElementsByClassName(cls);
        for(let i = 0; i < elems.length; i++) callback(elems[i]);
    }
    forEachClass(elems,callback)
    {
        for(let i = 0; i < elems.length; i++) callback(elems[i]);
    }
    onClassClick(cls,callback)
    {
        let elems = this.element.getElementsByClassName(cls);
        for(let i = 0; i < elems.length; i++)
        {
            let elem = elems[i];
            elem.addEventListener("click",(e)=>{callback(elem,e)},false);
        }
    }
}


class DashboardPanel extends Panel
{
    constructor(name)
    {
        super(name);
    }
    onHide(){
    }
    init(){
        console.log("initting");
    }  
}

class AddPanel extends Panel
{
    constructor(name, type)
    {
        super(name);
        this.url = type.toLowerCase();
        this.contentHolder = this.element.getElementsByClassName("boxFlexHolder")[0];
        this.editForm = new DashbordFormElement("edit","Edit " + type);
        this.addForm = new DashbordFormElement("add","Add " + type,"Add");
        this.deleteForm = new DashbordFormElement("delete","Delete " + type,"Are you sure?");

        this.setForm();

        this.editForm.build();
        this.addForm.build();
        this.deleteForm.build();
        
    }

    removeOnClick(e,elem)
    {
        let parent = elem.parentNode.parentNode;
        this.deleteForm.setAttribute("id",parent.getAttribute("data-id"));
        this.deleteForm.setAttribute("parent",parent);
        this.deleteForm.render();
    }

    getElementDom(data)
    {

    }

    init()
    {
        let holder = this.contentHolder; 
        this.addForm.onSubmit((data)=>
        {
            let url = new Url("./dashboard/"+this.url+"/add/",{name:data.Name,url:data.Url,nx:data.Nx,time:data.Time});
            HttpHandler.postData(url,(response)=>
            {
                if(response.success)
                {
                    data.key = response.id;
                    let element = document.createElement("div");
                    element.innerHTML = this.getElementDom(data);

                    let download = element.getElementsByClassName("downloadBox")[0];
                    download.setAttribute("data-id",response.id);
                    let clickElement = download.getElementsByClassName("edit")[0];
                    let removeElement = download.getElementsByClassName("remove")[0];
                    clickElement.addEventListener("click",(e)=>this.editOnClick(e,clickElement),false);
                    removeElement.addEventListener("click",(e)=>this.removeOnClick(e,removeElement),false);

                    this.contentHolder.appendChild(download);
                    download.style.transition="none";
                    download.style.opacity="0";
                    download.style.flexGrow="0";
                    download.style.minWidth="0";

                    setTimeout(()=>
                    {
                        download.style.transition="ease 0.2s";
                        download.style.opacity="1";
                        download.style.flexGrow="1";
                        download.style.minWidth="20em";
                    },10);

                    this.addForm.hide();
                }
            });
        });

        this.deleteForm.onSubmit((data)=>
        {
            let url = new Url("./dashboard/"+this.url+"/remove/",{id:data.attributes.id});
            HttpHandler.postData(url,(response)=>
            {
                console.log(response);
                data.attributes.parent.style.opacity="0";
                data.attributes.parent.style.flexGrow="0.0001";
                data.attributes.parent.style.minWidth="0";
                
                setTimeout(()=>
                {
                    data.attributes.parent.remove();
                },600);

                this.deleteForm.hide();
            });
        });

        this.forEachElement("remove",(elem)=>
        {
            elem.addEventListener("click",(e)=>this.removeOnClick(e,elem),false);
        });

        this.onClick("add",()=>
        {
            this.addForm.render();
        });

        this.forEachElement("edit",(elem)=>
        {
            elem.addEventListener("click",()=>
            {
                this.onEdit(elem);
                this.editForm.render();
            },false);
        });

    }
    setForm()
    {

    }
    setValue(parent,type,value,callback)
    {
        for(let i = 0; i < parent.childNodes.length; i++)
        {
            if(parent.childNodes[i].nodeType == Node.TEXT_NODE) continue;
            console.log(parent.childNodes[i]);
            if(parent.childNodes[i].getAttribute("data-type") == type)
            {
                callback(parent.childNodes[i],value);
                return;
            } 
        }
    }
    onEdit(edit){}
}

class DownloadPanel extends AddPanel
{
    constructor(name)
    {
        super(name,"Download");
    }

    setForm()
    {
        this.editForm.addInput({name:"Name",type:"input",label:"Name"});
        this.editForm.addInput({name:"Url",type:"input",label:"Url"});

        this.addForm.addInput({name:"Name",type:"input",label:"Name"});
        this.addForm.addInput({name:"Url",type:"input",label:"Url"});
    }
    onEdit(edit)
    {
        this.editForm.setValue("Name",edit.getAttribute("data-name"));
        this.editForm.setValue("Url",edit.getAttribute("data-url"));
        this.editForm.setAttribute("key",edit.getAttribute("data-key"));
    }
    getElementDom(data)
    {
        return `<div class="box downloadBox">
            <h3>${data.Name}</h3>
            <h4 data-type="Name">${data.Name}</h4>
            <h4 data-type="Download url" >${data.Url}</h4>
            <div class="boxBtns">
                <div class="dashBtn edit" data-key="${data.key}" data-name="${data.Name}" data-url="${data.Url}"><i class="fas fa-pen"></i></div>
                <div class="dashBtn remove"><i class="fas fa-trash"></i></div>
            </div>
        </div>`;
    }
    setInnerHTML(elem,value)
    {
        elem.innerHTML = value;
    }
    init(){
        super.init();
        this.editForm.onSubmit((data)=>
        {
            let url = new Url("dashboard/download/update",{name:data.Name,url:data.Url,key:data.attributes.key });
            HttpHandler.postData(url,(response)=>
            {
                let parent = document.getElementById("download-key-"+data.attributes.key);
                this.setValue(parent,"Name",data.Name,this.setInnerHTML);
                this.setValue(parent,"Url",data.Url,this.setInnerHTML);
            });
            this.editForm.hide();
        });
    }  
}

class VotePanel extends AddPanel
{
    constructor(name)
    {
        super(name,"Vote");
    }

    setForm()
    {
        this.editForm.addInput({name:"Name",id:"name",type:"input",label:"Name"});
        this.editForm.addInput({name:"Url",id:"url",type:"input",label:"Url"});
        this.editForm.addInput({name:"Nx",id:"nx",type:"input",label:"Nx"});
        this.editForm.addInput({name:"Time",id:"time",type:"input",label:"Time"});

        this.addForm.addInput({name:"Name",type:"input",label:"Name"});
        this.addForm.addInput({name:"Url",type:"input",label:"Url"});
        this.addForm.addInput({name:"Nx",type:"input",label:"Nx"});
        this.addForm.addInput({name:"Time",type:"input",label:"Time"});
    }
    onHide(){
    }
    onEdit(edit)
    {
        this.editForm.setValue("Name",edit.getAttribute("data-name"));
        this.editForm.setValue("Url",edit.getAttribute("data-url"));
        this.editForm.setValue("Nx",edit.getAttribute("data-nx"));
        this.editForm.setValue("Time",edit.getAttribute("data-time"));
        this.editForm.setAttribute("key",edit.getAttribute("data-key"));
    }
    getElementDom(data)
    {
        return  `<div class="box downloadBox voteBox" id="download_${data.Name}">
        <h3>${data.Name}</h3>
        <h4 data-type="Name">${data.Name}</h4>
        <h4 data-type="Download url" >${data.Url}</h4>
        <h4 data-type="Nx" >${data.Nx}</h4>
        <h4 data-type="Time" >${data.Time}</h4>
        <div class="boxBtns">
            <div class="dashBtn edit"
            data-name="${data.Name}"
            data-url="${data.Url}"
            data-nx="${data.Nx}"
            data-time="${data.Time}"
            data-key="${data.key}" 
            ><i class="fas fa-pen"></i></div>
            <div class="dashBtn remove"><i class="fas fa-trash"></i></div>
        </div>
    </div>`;
    }
    setInnerHTML(elem,value)
    {
        elem.innerHTML = value;
    }
    init(){
        super.init();
        this.editForm.onSubmit((data)=>
        {
            let url = new Url("dashboard/votes/update",{name:data.Name,url:data.Url,nx:data.Nx,time:data.Time,key:data.attributes.key });
            console.log(data);
            HttpHandler.postData(url,(response)=>
            {
                let parent = document.getElementById("vote-key-"+data.attributes.key);
                this.setValue(parent,"Name",data.Name,this.setInnerHTML);
                this.setValue(parent,"Url",data.Url,this.setInnerHTML);
                this.setValue(parent,"Time",data.Time,this.setInnerHTML);
                this.setValue(parent,"Nx",data.Nx,this.setInnerHTML);
            });
            this.editForm.hide();
        });
    }  
}

class DesignPanel extends Panel
{
    constructor(name,currentHeroImage)
    {
        super(name);
        this.heroImageElement = document.getElementsByClassName("panelHeroImage")[0];
        this.logoElement = document.getElementsByClassName("logoImage")[0];
        this.editHero = new DashbordFormElement("editHeroImage","Select new Heroimage","none"); 
        this.removePalette = new DashbordFormElement("removePalettem","Remove Palette, are you sure?","Delete");
        this.removePalette.build();
        
        this.editPalette = new DashbordFormElement("editPalette","Edit Palette","Save");
        this.editPalette.addAfterHTML(`
        <div class="paletteDisplay">
            <h2 class="paletteDisplayHeader">Example</h2>
            <h3 class="fontColorDark">Title</h3>
            <div class="mainColor">
                <h4 class="fontColorLight">light</h4>
            </div>
            <div class="btnHolder">
                <div class="btn btn-span secondaryMainColor"><p>Button</p></div>
                <div class="btn btn-span fillColor"><p>Button</p></div>
            </div>
        </div>`);
        this.editPalette.addInput({label:"Name", name:"name",id:"name",type:"input"});
        this.editPalette.addInput({label:"Main color", name:"mainColor",id:"mainColor",type:"input",placeholder:"#FFF",color:true});
        this.editPalette.addInput({label:"Secondary main color", name:"secondaryMainColor",id:"secondaryMainColor",type:"input",placeholder:"#FFF",color:true});
        this.editPalette.addInput({label:"Font color dark", name:"fontColorDark",id:"fontColorDark",type:"input",placeholder:"#FFF",color:true});
        this.editPalette.addInput({label:"Font color light", name:"fontColorLight",id:"fontColorLight",type:"input",placeholder:"#FFF",color:true});
        this.editPalette.addInput({label:"Fill color", name:"fillColor",id:"fillColor",type:"input",placeholder:"#FFF",color:true});

        this.editPalette.build();

        let url = new Url("./dashboard/changeImage");



        HttpHandler.postData(url,(response)=>
        {
            if(response.success)
            {

                let files = response.files;
                let html = `<div class="heroImageEditWrapper">`;
                files.forEach(file => {
                    if(file == currentHeroImage)
                        html += `<div data-image="${file}" class="heroImageEdit selectedHeroImage" style="background:url(./images/${file}) no-repeat"></div>`
                    else
                        html += `<div data-image="${file}" class="heroImageEdit" style="background:url(./images/${file}) no-repeat"></div>`;
                });
                html += `</div><p>Images selected from <strong>public/images</strong> folder</p>`;


                this.editHero.setHTML(html);
                this.editHero.build();
                let editHeroTitle = this.editHero.form.getElementsByTagName("h3")[0];
                this.onClick("editHero",()=>
                {
                    this.editHero.setAttribute("hero",true);
                    editHeroTitle.innerHTML = "Select new Hero Image";
                    this.editHero.render();
                });
                this.onClick("editLogo",()=>
                {
                    this.editHero.setAttribute("hero",null);
                    editHeroTitle.innerHTML = "Select new Logo";
                    this.editHero.render();
                });

                let form = this.editHero.form;
                let fileElements = form.getElementsByClassName("heroImageEdit");
                for(let i = 0; i < fileElements.length; i++)
                {
                    let image = fileElements[i];
                    image.addEventListener("click",()=>
                    {
                        //NEW IMAGE SELECTED
                        if(this.editHero.attributes.hero)
                        {
                            let url = new Url("./dashboard/heroImage/change",{file:image.getAttribute("data-image")});
                            HttpHandler.postData(url,(response)=>
                            {
                                if(!response.success) console.log(response.reason);
                                this.editHero.hide();
                                for(let j = 0; j < fileElements.length; j++)
                                {
                                    fileElements[j].className = "heroImageEdit";
                                }
                                image.className += " selectedHeroImage";
                                this.heroImageElement.style.background=`url(./images/${image.getAttribute("data-image")})`;
                            });
                        }
                        else
                        {
                            let url = new Url("./dashboard/logo/change",{file:image.getAttribute("data-image")});
                            HttpHandler.postData(url,(response)=>
                            {
                                if(!response.success) console.log(response.reason);
                                this.editHero.hide();
                                for(let j = 0; j < fileElements.length; j++)
                                {
                                    fileElements[j].className = "heroImageEdit";
                                }
                                image.className += " selectedHeroImage";
                                this.logoElement.style.background=`url(./images/${image.getAttribute("data-image")})`;
                            });                            
                        }
                    },false);
                }
            }
        });


    }

    onHide(){
    }
    editOnClick(e,elem)
    {

    }
    onEditPaletteClick(elem,e)
    {
        this.editPalette.setAttribute("add",false);
        this.editPalette.setValue("mainColor",elem.getAttribute("data-mainColor"));
        this.editPalette.setValue("secondaryMainColor",elem.getAttribute("data-secondaryMainColor"));
        this.editPalette.setValue("fontColorDark",elem.getAttribute("data-fontColorDark"));
        this.editPalette.setValue("fontColorLight",elem.getAttribute("data-fontColorLight"));
        this.editPalette.setValue("fillColor",elem.getAttribute("data-fillColor"));
        this.editPalette.setValue("name",elem.getAttribute("data-name"));
        this.editPalette.setAttribute("key",elem.getAttribute("data-key"));
        this.editPalette.setAttribute("element",elem);
        this.editPalette.submitTitle("Save");
        this.editPalette.render();


    }
    onRemovePaletteClick(elem)
    {
        this.removePalette.setAttribute("key",elem.getAttribute("data-key"));
        this.removePalette.setAttribute("element",elem);
        this.removePalette.render();
    }
    init(){
        let display = this.editPalette.form.getElementsByClassName("paletteDisplay")[0];
        let mainColor = display.getElementsByClassName("mainColor");
        let secondaryMainColor = display.getElementsByClassName("secondaryMainColor");
        let fontColorDark = display.getElementsByClassName("fontColorDark");
        let fontColorLight = display.getElementsByClassName("fontColorLight");
        let fillColor = display.getElementsByClassName("fillColor");
        this.editPalette.onChange((input)=>
        {
            console.log("changed!");
            switch(input.name)
            {
                case "mainColor":
                    this.forEachClass(mainColor,(e)=>{e.style.background=input.value});
                break;
                case "secondaryMainColor":
                    this.forEachClass(secondaryMainColor,(e)=>{e.style.background=input.value});
                break;
                case "fontColorDark":
                    this.forEachClass(fontColorDark,(e)=>{e.style.color=input.value});
                break;
                case "fontColorLight":
                    this.forEachClass(fontColorLight,(e)=>{e.style.color=input.value});
                break;
                case "fillColor":
                    this.forEachClass(fillColor,(e)=>{e.style.background=input.value});
                break;
            }
        });
        this.onClick("addPalette",()=>
        {
            this.editPalette.clear();
            this.editPalette.setAttribute("add",true);
            this.editPalette.submitTitle("Add");
            this.editPalette.render();
        });
        this.onClassClick("editPalette",(elem,e)=>
        {
            this.onEditPaletteClick(elem,e);
        });

        this.editPalette.onSubmit((data)=>
        {
            data.key = data.attributes.key;
            let add = data.attributes.add;

            if(add)
            {
                delete data.attributes;
                let url = new Url("dashboard/palette/add",data);
                HttpHandler.postData(url,(response)=>
                {
                    if(response.success)
                    {
                        let div = document.createElement("div");
                        div.innerHTML = `
                        <div class="box downloadBox paletteBox" data-id="${response.key}">
                            <h3>Palette</h3>
                            <h4 data-type="Name">${data.name}</h4>
                            <div class="palette">
                                <div class="colorPalette mainColor" style="background:${data.mainColor}"></div>
                                <div class="colorPalette secondaryMainColor" style="background:${data.secondaryMainColor}"></div>
                                <div class="colorPalette fontColorDark" style="background:${data.fontColorDark}>"></div>
                                <div class="colorPalette fontColorLight" style="background:${data.fontColorLight}"></div>
                                <div class="colorPalette fillColor" style="background:${data.fillColor}"></div>
                            </div>
                            <div class="boxBtns">
                                <div class="dashBtn select info" data-info="Select palette" data-key="${response.key}"><i class="fas fa-mouse-pointer"></i></div>
                                <div class="dashBtn editPalette info" data-info="Edit Palette"
                                data-name="${data.name}"
                                data-mainColor="${data.mainColor}"
                                data-secondaryMainColor="${data.secondaryMainColor}"
                                data-fontColorDark="${data.fontColorDark}"
                                data-fontColorLight="${data.fontColorLight}"
                                data-fillColor="${data.fillColor}"
                                data-key="${response.key}" 
                                ><i class="fas fa-pen"></i></div>
                                <div class="dashBtn remove info" data-key="${response.key}" data-info="Remove Palette"><i class="fas fa-trash"></i></div>
                            </div>
                        </div>
                        `;
                        let select = div.getElementsByClassName("select")[0];
                        select.addEventListener("click",this.onSelectClick.bind({elem:select,select:this.select,onSelect:this.onSelectClick}),false);
                        let elem = div.getElementsByClassName("downloadBox")[0];
                        console.log(elem);
                        get("boxFlexHolder",get("designpanel"))[0].appendChild(elem);
                        elem.getElementsByClassName("editPalette")[0].addEventListener("click",(e)=>
                        {
                            this.onEditPaletteClick(elem.getElementsByClassName("editPalette")[0],e);
                        },false);

                        elem.getElementsByClassName("remove")[0].addEventListener("click",(e)=>
                        {
                            this.onRemovePaletteClick(elem.getElementsByClassName("remove")[0]);
                        },false);
                    }
                });
            }
            else
            {
                let url = new Url("dashboard/palette/update",data);
                HttpHandler.postData(url,(response)=>
                {
                    if(response.success)
                    {
                        let element = data.attributes.element.parentNode.parentNode;
                        element.getElementsByTagName("h4")[0].innerHTML = data.name;
                        element.getElementsByClassName("mainColor")[0].style.background = data.mainColor;
                        element.getElementsByClassName("secondaryMainColor")[0].style.background = data.secondaryMainColor;
                        element.getElementsByClassName("fontColorDark")[0].style.background = data.fontColorDark;
                        element.getElementsByClassName("fontColorLight")[0].style.background = data.fontColorLight;
                        element.getElementsByClassName("fillColor")[0].style.background = data.fillColor;
                    }
                });
            }
            this.editPalette.hide();
        });

        this.removePalette.onSubmit((data)=>
        {
            let key = data.attributes.key;
            let url = new Url("dashboard/palette/remove",{key:key});
            HttpHandler.postData(url,(response)=>
            {
                if(response.success)
                {
                    data.attributes.element.parentNode.parentNode.remove();
                }
                this.removePalette.hide();
            });
        })

        this.onSelectClick = function()
        {
            if(this.elem && !this.elem.className.includes("activeBtn"))
                this.select(this.elem,this.onSelect,this.select);
        };
        this.forEachElement("select",(elem)=>
        {
            elem.addEventListener("click",this.onSelectClick.bind({elem:elem,select:this.select,onSelect:this.onSelectClick}),false);
        });
        this.forEachElement("remove",(elem)=>
        {
            elem.addEventListener("click",()=>this.onRemovePaletteClick(elem),false);
        });
    }
    select(elem,onSelect,select)
    {
        console.log(elem);
        let url = new Url("dashboard/palette/select",{key:elem.getAttribute("data-key")});
        HttpHandler.postData(url,(response)=>
        {
            if(response)
            {
                let element = get("activeBtn")[0];
                if(element)
                {
                    element.innerHTML = `<i class="fas fa-mouse-pointer"></i>`;
                    element.className = "dashBtn select info";
                    element.setAttribute("data-info","Select Palette");
                    element.addEventListener("click",this.onSelect.bind({elem:element,select:select,onSelect:onSelect}),false);
                }
                elem.className += " activeBtn";
                elem.innerHTML = `<i class="fas fa-check"></i>`;
                elem.setAttribute("data-info","Current Palette");
                elem.removeEventListener("click",this.onSelect.bind({elem:elem,select:select,onSelect:onSelect}),false);
            }
        });
    }      
}


class LayoutPanel extends Panel
{
    constructor(name,color)
    {
        super(name,{loadable:true});

        this.panels;
        this.color = color;
        this.edited = false;
        this.saveBtn = document.getElementById("saveLayout");
        this.container = document.getElementsByClassName("layoutWrapper")[0];
    }
    setZindex(box)
    {
        if(this.lastHover)
            this.lastHover.style.zIndex= "10";
        box.style.zIndex = "100";
        this.lastHover = box;
    }
    onEdit()
    {
        if(!this.edited)
        {
            //Display sabe button
            this.saveBtn.className = "btn";
            this.edited = true;
        }
    }
    init()
    {
        console.log("layout init");
        let height = document.getElementById("height");
        height.value=120;
        let rows = document.getElementById("aor");
        rows.value=13;
        let columns = document.getElementById("aoc");
        columns.value=9;
        let padding = document.getElementById("padding");
        padding.value=1.5;
        let container = this.container;
        height.addEventListener("keyup",(e)=>
        {
            console.log(height.value);
            container.style.height=height.value+"em";
            this.onEdit();
        },false);
        rows.addEventListener("keyup",(e)=>
        {
            this.onEdit();
            console.log("1fr ".repeat(rows.value));
            container.style.gridTemplateRows = "1fr ".repeat(rows.value);
        },false);

        columns.addEventListener("keyup",(e)=>
        {
            this.onEdit();
            container.style.gridTemplateColumns = "1fr ".repeat(columns.value);
        },false);

        padding.addEventListener("keyup",(e)=>
        {
            container.style.gridColumnGap = padding.value + "em";
            container.style.gridRowGap = padding.value + "em";
            this.onEdit();
        },false);

        let layoutMover = new Mover("layoutMover",Direction.Y);
        layoutMover.onMove((deltaY)=>
        {
            console.log(-deltaY/16);
            layoutMover.newHeight = layoutMover.height + -deltaY/16;
            layoutMover.mover.parentNode.style.height = layoutMover.newHeight + "em";
            height.value = layoutMover.newHeight;
            this.onEdit();
        });



        this.onClassClick("selectPanel ",(elem)=>
        {
            this.editPanelForm.setAttribute("panel",elem.getAttribute("data-panelid"));
            this.editPanelForm.render();
        });
        this.editPanelForm.onSubmit((data)=>
        {
            this.onEdit();
            this.panels[data.attributes.panel].panel = data.panelSelect;
            this.panels[data.attributes.panel].name = data.panelSelect + "_box";
            this.editPanelForm.hide();
            let element = this.container.getElementsByClassName("panel_id_"+data.attributes.panel)[0];
            element.getElementsByTagName("h2")[0].innerHTML = "Panel " + data.attributes.panel + " - " + data.panelSelect
        });
        this.lastHover;
        this.forEachElement("layout_box",(box)=>
        {
            box.mouseDown = false;
            let panel = this.panels[box.getAttribute("data-panelID")];
            let mover = new Mover();

            mover.setMoverElement(box.getElementsByClassName("mover")[0],Direction.Y);

            let horizontalMover = new Mover();
            horizontalMover.setMoverElement(box.getElementsByClassName("mover_vertical")[0],Direction.X);

            if(panel)
            {
                
                panel.newPos = {};
                panel.newSize = {columnSize:panel.columns.size,rowSize:panel.rows.size};
                horizontalMover.onMove((delta)=>
                {
                    let size = panel.columns.size+Math.floor((-delta/this.pixelSize)*columns.value);
                    if(size-1 <= panel.columns.pos || size > parseInt(columns.value)+1) return;
                    panel.newSize.columnSize = size;
                    box.style.gridColumn = `${panel.columns.pos}/${size}`;
                });

                horizontalMover.onDone(()=>
                {
                    this.onEdit();
                    panel.columns.size = panel.newSize.columnSize;
                });

                mover.onMove((delta)=>
                {
                    let size = panel.rows.size+Math.floor((-delta/this.pixelSize)*rows.value);
                    if(size+1 <= panel.rows.pos || size > parseInt(rows.value)+1) return;
                    panel.newSize.rowSize = size;
                    box.style.gridRow = `${panel.rows.pos}/${size}`;
                });

                mover.onDone(()=>
                {
                    this.onEdit();
                    panel.rows.size = panel.newSize.rowSize;
                });

                box.addEventListener("click",()=>
                {
                    this.setZindex(box);
                },false);

                box.addEventListener("mousedown",(e)=>
                {
                    if(!e.target.className.includes("layout_box") && !e.target.className.includes("infoBox")) return;
                    box.timeout = setTimeout(()=>
                    {
                        box.mousePos = {x:e.clientX,y:e.clientY};
                        box.mouseDown = true;
                        box.style.background=this.color;
                        this.setZindex(box);
                        this.onEdit();
                    },200);
                },false);

                document.addEventListener("mousemove",(e)=>
                {
                    if(box.mouseDown)
                    {
                        let deltaPos = {x:e.clientX-box.mousePos.x,y:e.clientY-box.mousePos.y};
                        let normalizedPos = {x:Math.floor((deltaPos.x/this.pixelSize)*columns.value),y:Math.floor((deltaPos.y/this.pixelSize)*rows.value)}
                        
                        console.log(normalizedPos.y+panel.newSize.rowSize);
         
                        if(panel.rows.pos+normalizedPos.y > 0 && normalizedPos.y+panel.rows.size <= parseInt(rows.value)+1)
                        {    
                            box.style.gridRow = `${Math.max(1,panel.rows.pos+normalizedPos.y)}/${normalizedPos.y+panel.rows.size}`;
                            panel.newPos.y = normalizedPos.y;
                        }
                        if(panel.columns.pos+normalizedPos.x > 0 && normalizedPos.x+panel.columns.size <= parseInt(columns.value)+1)
                        {       
                            box.style.gridColumn = `${Math.max(1,panel.columns.pos+normalizedPos.x)}/${normalizedPos.x+panel.columns.size}`;
                            panel.newPos.x = normalizedPos.x;
                        }
                    }
                },false);

                document.addEventListener("mouseup",()=>
                {
                    if(box.timeout)
                        clearTimeout(box.timeout);
                    if(box.mouseDown)
                    {
                        this.onEdit();
                        box.mouseDown = false;
                        box.style.background="white";
                        if(panel.newPos.y)
                        {
                            panel.rows.pos += panel.newPos.y;
                            panel.rows.size += panel.newPos.y;
                        }
                        if(panel.newPos.x)
                        {
                            panel.columns.pos += panel.newPos.x;
                            panel.columns.size += panel.newPos.x;
                        }
                    }
                },false);
                console.log(this.panels);
                this.saveBtn.addEventListener("click",()=>
                {
                    if(this.edited)
                    {
                        this.edited = false;
                        this.saveBtn.className = "btn disabled-btn";
                        let data = {};
                        Object.keys(this.panels).forEach((key)=>
                        {
                            data[key] = this.panels[key];
                            delete data[key].newPos;
                        });
                        let url = new Url("/dashboard/layout",{json:JSON.stringify(data),name:"home"});
                        HttpHandler.postData(url,(response)=>{});
                    }
                },false);

            }
        });

    }
    visible()
    {
        this.pixelSize = this.container.clientWidth;
        console.log(this.pixelSize);
    }
    panelHTML(className,id,panel)
    {
        return `
        <div class="stats ${className} layout_box panel_id_${id}" data-panelID="${id}">
        <div class="panelHeader">
             <h2 class=" box_title">Panel ${id} - ${panel}</h2>
             <div class="dashBtn selectPanel info" data-panelID="${id}" data-info="Change Panel"><i class="fas fa-columns"></i></div>
             <div class="dashBtn remove info" data-info="Remove Panel"><i class="fas fa-trash-alt"></i></div>
         </div>     
         <div class="mover_vertical"><div class="moverIcon info" data-info="Resize width"><i class="fas fa-arrows-alt-v fa-rotate-90"></i></div></div>
         <div class="mover"><div class="moverIcon info" data-info="Resize height"><i class="fas fa-arrows-alt-v"></i></div></div>
         <div class="infoBox">Drag to move</div>
     </div>
        `;
    }
    onShow(show)
    {
        console.log("showing");
        if(!this.panels)
        {
            let url = new Url("dashboard/layout/home");
            HttpHandler.getData(url,(resp)=>
            {
                if(resp.success)
                {
                    this.panels = JSON.parse(resp.json.layout);
                    console.log(resp.content);
                    resp.content.forEach((file,index)=>{resp.content[index] = file.substring(0,file.length-4)});
                    this.editPanelForm = new DashbordFormElement("selectPanelForm","Select panel","Select");
                    this.editPanelForm.addInput({type:"select",values:resp.content,id:"panelSelect",name:"panelSelect",label:"Panel"});
                    this.editPanelForm.build();
                    Object.keys(this.panels).forEach((key)=>
                    {
                        let obj = this.panels[key];
                        let div = document.createElement("div");
                        div.innerHTML = this.panelHTML(obj.name,key,obj.panel);
                        let box = div.getElementsByClassName("layout_box")[0];
                        box.style.gridColumn = `${obj.columns.pos}/${obj.columns.size}`;
                        box.style.gridRow = `${obj.rows.pos}/${obj.rows.size}`;
                        this.container.appendChild(box);
                    });
                }
                show();
            });
        }   
        else
            show();
    }
}


class PanelHandler
{
    constructor()
    {
        this.panels = {};
        this.buttons = {};
        this.activePanel;
    }
    bindButton(btn,panel)
    {
        let btnDOM = document.getElementById(btn);
        panel.setMenuItem(btnDOM);
        btnDOM.addEventListener("click",()=>
        {
            this.showPanel(panel);
        },false);
    }
    addPanel(panel)
    {
        this.panels[panel.name] = panel;
        panel.handler = this;
        if(!panel.loadable)
            panel.init();
    }
    showPanel(panel)
    {
        if(panel == this.activePanel) return;
        if(this.activePanel)
            this.activePanel.hide();
        this.activePanel = this.panels[panel.name];
        this.activePanel.show();
    }
    hidePanel(panel)
    {
        this.activePanel = null;
        this.panels[panel.name].hide();
    }
    hideActivePanel()
    {
        this.activePanel.hide();  
        this.activePanel = null;
    }
}

class PanelTranslate
{
    start(element)
    {
        element.style.opacity="1";
        element.style.transform="scale(1)";
    }
    stop(element)
    {
        element.style.opacity="0";
        element.style.transform="scale(0.9)";
    }
    reset(element)
    {
        element.style.transform="scale(0.9)";
    }
}

class DashbordFormElement
{
    constructor(id,name,submit)
    {
        this.inputs = [];
        this.id = id;
        this.form = document.createElement("div");
        this.form.className = "formElementWrapper";
        this.form.id = id;
        this.name = name;
        this.submit = submit ? submit : "Save";
        this.attributes = {};
        this.html = "";
        this.afterHtml = "";
        this.change = ()=>{};
    }

    setValue(id,value)
    {
        let inps = this.form.getElementsByTagName("input");
        let input = null;
        for(let i = 0; i < inps.length; i++)
            if(inps[i].name == id)
            {
                input = inps[i];
                break;
            }
        if(!input) return;
        input.value = value;
        console.log(input);
        this.change(input);
    }

    addInput(settings)
    {
        let isDropdown = false;
        if(settings.type == "select")
        {
            isDropdown = true;
            settings.type = "select";
            settings.selectedIndex = 0;
        }
        let input = document.createElement(settings.type);

        input.setAttribute("autocomplete","off");
        input.name = settings.name;
        input.id = settings.name;
        input.className += "formElementInput input";
        if(settings.placeholder)
            input.placeholder = settings.placeholder;

        if(settings.value)
            input.value = settings.value;
        if(settings.label)
        {
            let label = document.createElement("label");
            label.setAttribute("for",settings.name);
            label.className = "formElementLabel";
            label.innerHTML = settings.label;
            this.inputs.push(label);
        }
        if(isDropdown)
        {
            settings.values.forEach((val)=>
            {
                input.innerHTML += `<option value="${val}">${val}</option>`;
            });
            input.selectedIndex = settings.selectedIndex;
        }
        this.inputs.push(input);
        if(settings.color)
        {
            input.setAttribute("data-colorPicker",true);
            input.className += " colorPickerInput";
        }
    }
    onSubmit(cb)
    {
        this.onSubmit = cb;
    }
    build()
    {
        let form = document.createElement("form");
        form.className += "formElement";
        form.innerHTML += `<div class="closeForm"><i class="fas fa-times"></i></div>`;
        form.innerHTML += "<h3>"+this.name+"</h3>";

        let wrapper = document.createElement("div");
        wrapper.className = "formContentWrapper";

        let wrapperInput = document.createElement("div");
        wrapperInput.className = "formInputWrapper";
        if(this.html)
            form.innerHTML += this.html;
        else
        {            
            this.inputs.forEach(element => {
                wrapperInput.appendChild(element);
            });
            wrapper.appendChild(wrapperInput);
            if(this.afterHtml)
                wrapper.innerHTML += this.afterHtml;
        }
        form.appendChild(wrapper);
        if(this.submit != "none")
            form.innerHTML += "<input type=\"submit\" class=\"btn btn-a formSubmit\" value=\""+this.submit+"\">";
        form.onsubmit = (e)=>
        {
            e.preventDefault();
            let data = {};
            data.attributes = this.attributes;
            let inputs = this.form.querySelectorAll("input,select");
            for(let i = 0; i < inputs.length-1; i++)
            {
                let element = inputs[i];
                data[element.name] = element.value;
            }
            if(this.onSubmit) this.onSubmit(data);
        };

        this.form.appendChild(form);
        document.body.appendChild(this.form);
        this.form.getElementsByClassName("closeForm")[0].addEventListener("click",()=>
        {
            this.hide();
        });
    
        let pickers = this.form.getElementsByTagName("input");
        for(let i = 0; i < pickers.length-1; i++)
        {
            let picker = pickers[i];
            if(picker.className.includes("colorPickerInput"))
                this.addColorElement(picker);
        }    
    }
    setAttribute(id,value)
    {
        this.attributes[id] = value;
    }
    hide()
    {
        
        this.form.style.opacity="0";
        this.form.style.transform="scale(0.9)";
        setTimeout(() => {
            this.form.style.display="none";
        }, 410); 
    }

    setHTML(html)
    {
        this.html = html;
    }
    
    render(parent)
    {
        this.form.style.display="flex";
        setTimeout(() => {
            this.form.style.opacity="1";
            this.form.style.transform="scale(1)";
        }, 20);
    }
    clear()
    {
        let pickers = this.form.getElementsByTagName("input");
        for(let i = 0; i < pickers.length-1; i++)
        {
            let picker = pickers[i];
            picker.value = "";
        }   
    }
    submitTitle(title)
    {
        this.form.getElementsByClassName("formSubmit")[0].value = title;
    }
    onChange(cb)
    {
        this.change = cb;
    }
    addHTML(html)
    {
        this.html += html;
    }
    addAfterHTML(html)
    {
        this.afterHtml += html;
    }
    addColorElement(input)
    {
        let self = this;
        AppendableElement.setParent(this.form);
        if(!this.colorPicker)
            this.colorPicker = new ColorPicker();
            
        if(!self.colorPicker.isAppended) self.colorPicker.appendDom();
        self.colorPicker.hide();
        input.addEventListener("focus",function()
        {
            if(!self.colorPicker.isActive) self.colorPicker.show();
            self.colorPicker.setHex("#FFFFFF");
            let position = input.getBoundingClientRect();
            self.colorPicker.move(position.left,position.top-30);
            console.log(self.colorPicker.pos.y + self.colorPicker.getHeight(),window.innerHeight);
            if(self.colorPicker.pos.y + self.colorPicker.getHeight() > window.innerHeight-100)
                self.colorPicker.move(position.left,position.top-self.colorPicker.getHeight()-input.clientHeight-60);
            if(input.value[0] == '#' && input.value.length >= 2)
            {
                if(!self.colorPicker.isAppended) self.colorPicker.appendDom();
                if(!self.colorPicker.isActive) self.colorPicker.show();
                self.colorPicker.setHex(input.value.repeatLastCharacter(7).toString());
                
            }  
            self.colorPicker.onSubmit((hex)=>
            {
                input.value = hex;
                //self.valueChange(input);
                self.change(input);
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
                    self.change(input);
                }
            },false);
            self.colorPicker.onRevert((hex)=>
            {
                self.colorPicker.hide();
            });
            self.colorPicker.show();
            });
            input.addEventListener("focusout",function()
            {
                //self.colorPicker.hide();
            },false);

    }
}
const Direction = {X:0,Y:1}; 
class Mover
{
    constructor(id,dir)
    {
        this.move = ()=>{};
        this.done = ()=>{};
        if(!id) return;
        this.setMoverElement(document.getElementById(id),dir);
    }
    setMoverElement(element,dir)
    {
        this.dir = dir;
        this.mover = element;
        this.moverIcon = this.mover.getElementsByClassName("moverIcon")[0];
        this.mouseDown = false;
        this.height = 120;
        this.newHeight = 120;
        this.mover.addEventListener("mousedown",(e)=>
        {
            console.log(e);
            this.moverIcon.style.transform="scale(1.2)";
            this.orgMousePos = {x:e.clientX,y:e.clientY};
            this.mouseDown = true;
        });
        document.addEventListener("mousemove",(e)=>
        {
            if(this.mouseDown)
            {
                this.move(this.dir == Direction.Y ? this.orgMousePos.y-e.clientY : this.orgMousePos.x-e.clientX);
            }        
        });

        document.addEventListener("mouseup",(e)=>
        {
            if(this.mouseDown)
            {
                this.moverIcon.style.transform="scale(1)";
                this.height = this.newHeight;
                this.done();
                this.mouseDown = false;
            }
        });       
    }
    setHeight(height)
    {

    }
    onDone(cb)
    {
        this.done = cb;
    }
    onMove(callback)
    {
        this.move = callback;
    }
}

let selected = {};
function reset(name,parent=document)
{
    selected[parent][name] = null;
}
function get(name,parent=document)
{
    if(!selected[parent]) selected[parent] = {};
    if(selected[parent][name]) return selected[parent][name];

    let id = document.getElementById(name);
    if(!id)
        id = parent.getElementsByClassName(name);
    selected[parent][name] = id;
    return id;
}
