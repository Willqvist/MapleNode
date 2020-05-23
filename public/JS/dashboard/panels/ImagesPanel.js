import Panel from './Panel.js';
import Http from "../../API/Http.js";
import Url from "../../API/Url.js";
import PopupForm from "../popup/PopupForm.js";

export default class ImagesPanel extends Panel {
    init() {
        super.init();
        this.registerTriggers();
    }

    async onPopupClick(state, data, popup) {
        console.log(data);
        popup.showProgress(0);
        if(state === PopupForm.RESULT && !data.close) {
            return new Promise(resolve => {
                const url = new Url('./dashboard/file/upload');
                Http.UPLOAD(url, data.file, {
                    begin() {
                        popup.showProgress(0);
                    },
                    progress(percent) {
                        popup.showProgress(percent);
                    },
                    done() {
                        resolve({error:false});
                    },
                });
            });
        }
        return {error:false};
    }
}
