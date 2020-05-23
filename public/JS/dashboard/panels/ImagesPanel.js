import Panel from './Panel.js';
import Http from "../../API/Http.js";
import Url from "../../API/Url.js";
import PopupForm from "../popup/PopupForm.js";
import Grid from "../../grid.js";

export default class ImagesPanel extends Panel {
    init() {
        super.init();
        this.registerTriggers();
        this.grid = new Grid('images');
    }

    appendGrid(file) {
        const data = {
            id: 'images',
            contentStyle:`flex-direction:row;padding-top:1rem;padding-bottom:1rem;`,
            image:`center / contain no-repeat url('upload/${file.name}')`,
            content: `
            <div class="mod_grid_item_content">
                <h2>${file.name}</h2>
            </div>
            <div class="grid_icons">
                <i class="grid_edit fas fa-ellipsis-v info" data-info="Set image as..."></i>
                <i class="grid_edit fas fa-trash-alt info" data-info="Delete Image"></i>
            </div>`
        };
        this.grid.append(data);
    }

    doneUpload(err, file, resolve) {
        if(err.reason)
            return resolve({error:err.reason});
        this.appendGrid(file);
        resolve({error:false});
    }

    async onPopupClick(state, data, popup) {
        console.log(data);
        popup.doneUpload();
        popup.showProgress(0);
        if(state === PopupForm.RESULT && !data.close) {
            return new Promise(resolve => {
                const url = new Url('./dashboard/file');
                console.log(data.file);
                Http.UPLOAD(url, data.file, {
                    begin() {
                        popup.beginUpload();
                        popup.showProgress(0);
                    },
                    progress(percent) {
                        popup.showProgress(percent);
                    },
                done: ((err)=>{
                    popup.doneUpload();
                    this.doneUpload(err, data.file, resolve)}),
                });
            });
        }
        return {error:false};
    }
}
