export default class Grid {
    constructor(name) {
        this.grid = document.getElementById(`grid_${name}`);
    }

    findByGridId(id) {
        const { children } = this.items;
        console.log(children);
        for(let i = 0; i < children.length; i++) {
            const child = children[i];
            if(child.getAttribute("grid-id") === id) return child;
        }
        return null;
    }

    remove(id) {
        const child = this.findByGridId(id);
        if(!child) return;

        this.grid.removeChild(child);
    }

    append(values) {
        const { id, header, content, image, contentStyle } = values;
        const node = document.createElement("div");
        node.className = "mod_grid_item";
        node.setAttribute("grid-id", id);

        const headerContent = !header ? `
        <div class="mod_grid_blur" style="background:${image};"></div>
        <div class="mod_grid_fg" style="background:${image};"></div>
        ` : header;

        node.innerHTML = `
            <div class="mod_grid_item_image">
            ${headerContent};
            </div>
            <div class="mod_grid_item_content" style="${contentStyle}">
               ${content}
            </div>
        `;
        this.grid.appendChild(node);
        return node;
    }

}
