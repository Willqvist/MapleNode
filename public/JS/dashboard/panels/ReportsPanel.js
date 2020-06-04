import Panel from './Panel.js';
import PopupProvider from "../popup/PopupProvider.js";
import List from "../../list.js";
import PopupForm from "../popup/PopupForm.js";
import Url from "../../API/Url.js";
import Http from "../../API/Http.js";

export default class ReportsPanel extends Panel {


    init() {
        super.init();
        this.remove = PopupProvider.get('removePopup');
        this.remove.bindButton(this.getAll('remove'), this.onRemoveReport.bind(this));

        this.remove = PopupProvider.get('removePopup');
        this.remove.bindButton(this.getAll('ban'), this.onBan.bind(this));

        this.list = new List("Reports");
        this.bindPanels();
    }

    async onRemoveReport(status,data,popup) {
        if(status === PopupForm.RESULT && !data.close) {
            const url = new Url('./IO/reports', {key: data.id});
            const response = await Http.DELETE(url);
            if(response.reason) return {error:response.reason};
            this.list.remove(data.id);
        }
        return {error: false};
    }

    async onBan(status,data,popup) {
        if(status === PopupForm.RESULT && !data.close) {
            const url = new Url('./IO/reports/ban', {victimid: data.src, ban: true});
            const response = await Http.POST(url);
            if(response.reason) return {error:response.reason};
            const items = this.list.getElementsByAttribute("victim",data.src);
            console.log(items);

            for(let i = 0; i < items.length; i++) {
                items[i].getElementsByClassName('mod_list_item_bottom')[0].getElementsByTagName('span')[0].innerHTML = "HANDLED"
                items[i].getElementsByClassName('mod_list_extended')[0].getElementsByTagName('li')[4].innerHTML = `<span>Banned:</span>true`;
            }

        }
        return {error: false};
    }

    async removeAll(elem) {
        const url = new Url('./IO/reports/all');
        const response = await Http.DELETE(url);
        if(response.reason) return {error:response.reason};
        this.list.removeAll();
        return {error: false};
    }

    readLog(elem) {
        const id = elem.parentNode.parentNode.parentNode.getAttribute("list-id");
        this.list.openExtend(id, 25);
    }

}
