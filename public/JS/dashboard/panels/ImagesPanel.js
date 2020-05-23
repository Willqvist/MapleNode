import Panel from './Panel.js';
import Http from "../../API/Http.js";
import Url from "../../API/Url.js";

export default class ImagesPanel extends Panel {
    init() {
        super.init();
        this.registerTriggers();
    }

    async onPopupClick(state, data, popup) {
        return new Promise(resolve => {
            const url = new Url('./dashboard/images/upload');
            Http.UPLOAD(url, "file",{
                begin(){},
                progress(percent){},
                done(){
                    resolve();
                },
            });
        });
    }
}
