import Panel from './Panel.js';
import Http from "../../API/Http.js";
import Url from "../../API/Url.js";
import PopupForm from "../popup/PopupForm.js";
import Grid from "../../grid.js";
import PopupProvider from "../popup/PopupProvider.js";

export default class ImagesPanel extends Panel {
    init() {
        super.init();
        this.registerTriggers();
        this.remove = PopupProvider.get('removePopup');
        this.remove.bindButton(this.getAll('remove'), this.onRemoveFile.bind(this));

        this.listPopup = PopupProvider.get('listPopup');
        this.listPopup.bindButton(this.getAll('trigger-list'), this.onTagChange.bind(this));
        this.grid = new Grid('images');
    }

    async onRemoveFile(state, data, popup) {
        if(state === PopupForm.RESULT && !data.close) {
            const url = new Url('./dashboard/file', {file: data.id});
            const response = await Http.DELETE(url);
            console.log(response);
            return {error: response.reason}
        }
        return {error: false};
    }

    async onTagChange(state, data, popup) {
        if(state === PopupForm.CLICK) {
            popup.asList(window.tags);
        }
        if(state === PopupForm.RESULT && !data.close) {
            console.log(data);
            const url = new Url('./dashboard/file/tag', {tag: data.tag, file: data.id});
            const response = await Http.UPDATE(url);
            return {error: response.reason};
        }
        return {error: false};
    }

    appendGrid(file) {
        const data = {
            id: 'images',
            contentStyle:`flex-direction:row;padding-top:1rem;padding-bottom:1rem;`,
            image:`center / contain no-repeat url('upload/${file.name}')`,
            content: `
            <div class="mod_grid_item_content">
                <h2>${file.name}</h2>
                <div class="mod_grid_actives">
                    <div class="mod_grid_active info" data-info="Add tag"><i class="fas fa-plus"></i></div>
                </div>
            </div>
            <div class="grid_icons" id="${file.name}">
                <i class="grid_edit fas fa-trash-alt info remove" popup-data="<.id=id,#Are you sure?=title,#Yes remove it=submit" data-info="Delete Image"></i>
            </div>`
        };
        const node = this.grid.append(data);
        this.registerTrigger(node);
        this.remove.bindButton(node.getElementsByClassName('remove'), this.onRemoveFile.bind(this));
        this.listPopup.bindButton(node.getElementsByClassName('trigger-list'), this.onTagChange.bind(this));
        const infos = node.getElementsByClassName('info');
        for(let i = 0; i < infos.length; i++)
            window.registerInfo(infos[i]);
    }

    doneUpload(err, file, resolve) {
        if(err.reason)
            return resolve({error:err.reason});
        this.appendGrid(file);
        resolve({error:false});
    }

    async onPopupClick(state, data, popup) {
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
