import Panel from './Panel.js';
import PopupProvider from "../popup/PopupProvider.js";
import List from "../../list.js";

export default class ReportsPanel extends Panel {


    init() {
        super.init();
        this.remove = PopupProvider.get('removePopup');
        this.remove.bindButton(this.getAll('remove'), this.onRemoveReport.bind(this));
        // this.reportList = new List("reports");
    }

    onRemoveReport(data,status,popup) {

    }

}
