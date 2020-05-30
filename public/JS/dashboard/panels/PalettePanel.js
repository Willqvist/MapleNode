import Panel from './Panel.js';
import PopupProvider from "../popup/PopupProvider.js";
import Grid from "../../grid.js";
import PopupForm from "../popup/PopupForm.js";
import Http from "../../API/Http.js";
import Url from "../../API/Url.js";

export default class PalettePanel extends Panel {
    init() {
        console.log("INIT PALETTES");
        super.init();
        this.remove = PopupProvider.get('removePopup');
        this.remove.bindButton(this.getAll('remove'), this.onRemovePalette.bind(this));
        this.grid = new Grid('palettes');
        this.registerTriggers();
        this.bindPanels();
    }

    async activeSet(elem) {
        const element = elem;
        const url = new Url('./dashboard/palette/select',
            {
                key: element.getAttribute('palette-key')
            });
        const response = await Http.POST(url);
        console.log(response);
        if(!response.reason) {
            const active = this.DOM.getElementsByClassName('active-palette')[0];
            if(active) {
                active.className = 'mod_grid_active info panel-bind';
                active.setAttribute('event', 'click');
                active.setAttribute('method', 'activeSet');
                active.setAttribute('data-info', 'Set as active palette');
                active.innerHTML = `<i class="fas fa-ellipsis-v"></i>`;
                this.bindPanel(active);
                window.registerInfo(active);
            }
            element.className = 'mod_grid_actives active-palette';
            element.innerHTML = `<div class="mod_grid_active"><i class="fas fa-check"></i><span>Active</span></div>`
            element.parentElement.replaceChild(element.cloneNode(true),element);
        }
    }

    async onRemovePalette(state, data, popup) {
        if(state === PopupForm.RESULT && !data.close) {
            console.log(data.id);
            const url = new Url('./dashboard/palette',
                {
                    key: data.id
                });
            const response = await Http.DELETE(url);
            if (response.reason) return {error: response.reason};
            this.grid.remove(data.id);
        }
        return {error: false};
    }

    appendGrid(data) {
        let contentsTag = `<div class="mod_grid_actives">`;
        contentsTag += `<div class="mod_grid_active info panel-bind" palette-key="${data.id}" event="click" method="activeSet" data-info="Set as active palette"><i class="fas fa-ellipsis-v"></i></div>`;
        contentsTag += `</div>`;
        const appendData = {
            id: 'palettes',
            itemId: data.id,
            contentStyle:`flex-direction:row;padding-top:1rem;padding-bottom:1rem;`,
            header: `
            <div class="grid_header_colors">
    <div class="grid_header_color" colorType="mainColor" color="${data.input_2}" style="background:${data.input_2}; color:${data.input_4}">Main color</div>
    <div class="grid_header_color" colorType="secondaryMainColor" color="${data.input_3}" style="background:${data.input_3}; color:${data.input_4}">Secondary main color</div>
    <div class="grid_header_color" colorType="fontColorDark" color="${data.input_5}" style="background:${data.input_5}; color:${data.input_4}">Font color light</div>
    <div class="grid_header_color" colorType="fontColorLight" color="${data.input_4}" style="background:${data.input_4}; color:${data.input_5}">Font color dark</div>
    <div class="grid_header_color" colorType="fillColor" color="${data.input_6}" style="background:${data.input_6}; color:${data.input_4}">Fill color</div>
</div>
`,
            content: `
<div class="mod_grid_item_content" id="palette_${data.id}">
    <h2>${data.id}</h2>
    ${contentsTag}
</div>
<div class="grid_icons grid_icons_row" id="${data.id}" style="flex-direction: row; align-items: center">
    <i class="grid_edit fas fa-edit info popup-trigger" trigger="palettePopup" popup-data="<.id=id,#Edit palette=title,<.id=src,<.id=input_1,<<<>div>div>div.color=input_2,<<<>div>div>div[1].color=input_3,<<<>div>div>div[2].color=input_4,<<<>div>div>div[3].color=input_5,<<<>div>div>div[4].color=input_6" data-info="Edit"></i>
    <i class="grid_edit fas fa-trash-alt info remove" popup-data="#palette=src,<.id=id,#Are you sure?=title,#Yes remove it=submit" data-info="Remove"></i>
</div>`
        };
        const node = this.grid.append(appendData);
        this.registerTrigger(node);
        this.remove.bindButton(node.getElementsByClassName('remove'), this.onRemovePalette.bind(this));
        this.bindPanel(node.getElementsByClassName('panel-bind')[0]);
    }

    editPalette(data) {
        const map = {
            'mainColor':data.input_2,
            'secondaryMainColor':data.input_3,
            'fontColorDark':data.input_4,
            'fontColorLight':data.input_5,
            'fillColor':data.input_6
        };
        console.log(data);
        const elem = document.getElementById(`grid_item_${data.id}`);
        console.log(data.id, elem);
        const colors = elem.getElementsByClassName('grid_header_color');
        for(let i = 0; i < colors.length; i++) {
            const color = colors[i];
            const attrib = color.getAttribute('colorType');
            console.log(color,attrib,map[attrib]);
            color.setAttribute('color',map[attrib]);
            color.style.background = map[attrib];
        }
        this.registerTrigger(elem);
    }

    async onPopupClick(state, dat, popup) {
        const data = dat;
        if(state === PopupForm.RESULT && !data.close) {
            if(data.id === '-1') {
                console.log(data);
                const url = new Url('./dashboard/palette',
                    {
                        name: data.input_1,
                        mainColor: data.input_2,
                        secondaryMainColor: data.input_3,
                        fontColorDark: data.input_4,
                        fontColorLight: data.input_5,
                        fillColor: data.input_6
                    });
                const response = await Http.POST(url);
                if(response.reason) return {error:response.reason};
                data.id = data.input_1;
                this.appendGrid(data);
            } else {
                const url = new Url('./dashboard/palette',
                    {
                        key: data.src,
                        mainColor: data.input_2,
                        secondaryMainColor: data.input_3,
                        fontColorDark: data.input_4,
                        fontColorLight: data.input_5,
                        fillColor: data.input_6
                    });
                const response = await Http.PUT(url);
                console.log(response);
                if(response.reason) return {error:response.reason};
                this.editPalette(data);

            }
        }
        return super.onPopupClick(state, data, popup);
    }
}
