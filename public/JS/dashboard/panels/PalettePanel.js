import Panel from './Panel.js';
import PopupProvider from "../popup/PopupProvider.js";
import Grid from "../../grid.js";
import PopupForm from "../popup/PopupForm.js";
import Http from "../../API/Http.js";
import Url from "../../API/Url.js";

export default class PalettePanel extends Panel {
    init() {
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

    appendGrid() {

    }

    async onPopupClick(state, data, popup) {
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
                this.appendGrid(data);
            } else {
                console.log(data);
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
                if(response.reason) return {error:response.reason};

            }
        }
        return super.onPopupClick(state, data, popup);
    }
}
