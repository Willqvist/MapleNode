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
        }
        return {error: false};
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
