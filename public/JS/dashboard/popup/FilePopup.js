import PopupForm from "./PopupForm.js";
import Grid from "../../grid.js";

export default class FilePopup extends PopupForm {

    setPanel(panel, listener) {
        this.panel = panel;
        this.panel.init();
        this.panel.addGrid(new Grid('popup-images'), listener);
    }
}
