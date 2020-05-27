import Panel from './Panel.js';
import PopupProvider from "../popup/PopupProvider.js";
import Grid from "../../grid.js";

export default class PalettePanel extends Panel {
    init() {
        super.init();
        this.remove = PopupProvider.get('removePopup');
        this.remove.bindButton(this.getAll('remove'), this.onRemovePalette.bind(this));
        this.grid = new Grid('palettes');
        this.registerTriggers();
    }

    async onRemovePalette(state, data, popup) {
        return {error: false};
    }
}
