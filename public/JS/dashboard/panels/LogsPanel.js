import Panel from './Panel.js';
import PopupProvider from "../popup/PopupProvider.js";
import List from "../../list.js";

export default class LogsPanel extends Panel {

    init() {
        super.init();
        this.remove = PopupProvider.get('removePopup');
        this.remove.bindButton(this.getAll('remove'), this.onRemoveReport.bind(this));
        this.logsList = new List("Logs");
        this.logsList.extendOnClick(9);
    }

    onRemoveReport(data,status,popup) {

    }
}
