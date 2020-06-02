import Panel from './Panel.js';
import PopupProvider from "../popup/PopupProvider.js";
import List from "../../list.js";
import PopupForm from "../popup/PopupForm.js";
import Url from "../../API/Url.js";
import Http from "../../API/Http.JS";

export default class LogsPanel extends Panel {

    init() {
        super.init();
        this.remove = PopupProvider.get('removePopup');
        this.remove.bindButton(this.getAll('remove'), this.onRemoveReport.bind(this));
        this.logsList = new List("Logs");
        this.bindPanels();
    }

    async onRemoveReport(status,data,popup) {
        if(status === PopupForm.RESULT && !data.close) {
            console.log("HERE");
            const url = new Url('./IO/logs', {key: data.id});
            const response = await Http.DELETE(url);
            if(response.reason) return {error:response.reason};
            this.logsList.remove(data.id);
        }
        return {error: false};
    }

    async removeAll(elem) {
            console.log("HERE");
            const url = new Url('./IO/logs/all');
            const response = await Http.DELETE(url);
            if(response.reason) return {error:response.reason};
            this.logsList.removeAll();
        return {error: false};
    }

    readLog(elem) {
        const id = elem.parentNode.parentNode.parentNode.getAttribute("list-id");
        this.logsList.openExtend(id, 8);
    }
}
