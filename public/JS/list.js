export default class List {
    constructor(name) {
        this.list = document.getElementById(`list_${name}`);
        this.items = this.list.getElementsByClassName("mod_list_items")[0];
    }

    findByListId(id) {
        const children = this.items.children;
        console.log(children);
        for(let i = 0; i < children.length; i++) {
            const child = children[i];
            if(child.getAttribute("list-id") == id) return child;
        }
        return null;
    }

    remove(id) {
        const child = this.findByListId(id);
        if(!child) return;

        this.items.removeChild(child);
    }

    append(values) {
        const { name, sublist, icon, id, buttons } = values;
        const node = document.createElement("div");
        node.className = "mod_list_item";
        node.setAttribute("list-id", id);

        node.innerHTML = `
            <i class="${icon} mod_list_icon"></i>
            <div class="mod_list_item_content">
                <div class="mod_list_item_top">
                    <p>${name}</p>
                </div>
                <div class="mod_list_break"></div>
                <div class="mod_list_item_bottom">
                    <ul>
                        ${Object.keys(sublist).map(key => {
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
        `;
        this.items.appendChild(node);
    }

}
