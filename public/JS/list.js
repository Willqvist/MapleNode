export default class List {
    constructor(name) {
        this.list = document.getElementById(`list_${name}`);
        this.items = this.list.getElementsByClassName("mod_list_items")[0];
        this.extOnClick = false;
        this.extended = {};
        this.extendHeight = 0;
    }

    extendOnClick(height) {
        this.extendHeight = height;
        this.list.className += " mod_list_hover";
        this.extOnClick = true;
        this.applyClickOnChildren(height);
    }

    applyClickOnChildren(height) {
        const { children } = this.items;
        for(let i = 0; i < children.length; i++) {
            this.appendExtendOnClick(children[i], height);
        }
    }

    appendExtendOnClick(elem, height) {
        elem.addEventListener("click",()=> {
            this.openExtend(elem.getAttribute("list-id"), height);
        },false);
    }

    removeAll() {
        this.items.innerHTML = "";
    }

    openExtend(id, height) {
        const item = this.findByListId(id);
        if(!item) return;
        const bottom = item.getElementsByClassName('mod_list_extended')[0];
        const ext = this.extended[id];
        bottom.style.maxHeight = `${!ext?height:0}rem`;
        bottom.style.opacity = `${!ext?1:0}`;
        this.extended[id] = !ext;
    }

    findByListId(id) {
        const { children } = this.items;
        for(let i = 0; i < children.length; i++) {
            const child = children[i];
            if(child.getAttribute("list-id") === id) return child;
        }
        return null;
    }

    remove(id) {
        const child = this.findByListId(id);
        if(!child) return;

        this.items.removeChild(child);
    }

    append(values) {
        const { name, sublist, icon, id, buttons, extended } = values;
        const node = document.createElement("div");
        node.className = "mod_list_item";
        node.setAttribute("list-id", id);
        const breaker = sublist ? `<div class="mod_list_break"></div>` : ``;
        node.innerHTML = `
            <div class="mod_list_main">
                <i class="${icon} mod_list_icon"></i>
                <div class="mod_list_item_content">
                    <div class="mod_list_item_top">
                        <p>${name}</p>
                    </div>
                    ${breaker}
                    <div class="mod_list_item_bottom">
                        <ul>
                            ${Object.keys(sublist ? sublist : {}).map(key => {
                                return `<li><strong>${key}</strong><span>${sublist[key]}</span></li>`;
                            }).join('')}
                        </ul>
                    </div>
                </div>
                <div class="mod_list_item_btns mod_list_btn" id="${id}">
                    ${buttons.map(button => {
                        button.attribs.class += ` ${button.icon}`;
                        return `<i ${Object.keys(button.attribs).map(key => {
                            return `${key}="${button.attribs[key]}" `;
                        }).join('')}>
                        ${button.content}</i>`;    
                    }).join('')}
                </div>
            </div>
             <div class="mod_list_extended">
                ${extended}
            </div>
        `;
        this.items.appendChild(node);

        if(this.extOnClick) {
            this.appendExtendOnClick(node);
        }

        return node;
    }

    getElementsByAttribute(name, src) {
        const { children } = this.items;
        const list = [];
        for(let i = 0; i < children.length; i++) {
            if(children[i].getAttribute(name) === src) {
                list.push(children[i]);
            }
        }
        return list;
    }
}
