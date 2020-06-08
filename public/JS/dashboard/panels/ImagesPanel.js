import Panel from './Panel.js';
import Http from "../../API/Http.js";
import Url from "../../API/Url.js";
import PopupForm from "../popup/PopupForm.js";
import Grid from "../../grid.js";
import PopupProvider from "../popup/PopupProvider.js";

export default class ImagesPanel extends Panel {
    static grids = [];
    init() {
        super.init();
        this.registerTriggers();
        this.remove = PopupProvider.get('removePopup');
        this.remove.bindButton(this.getAll('remove'), this.onRemoveFile.bind(this));
        this.listPopup = PopupProvider.get('listPopup');
        this.listPopup.bindButton(this.getAll('trigger-list'), this.onTagChange.bind(this));
    }

    addGrid(grid, listener) {
        ImagesPanel.grids.push({grid,listener, panel:this});
    }

    async onRemoveFile(state, data, popup) {
        console.log(data);
        if(state === PopupForm.RESULT && !data.close && data.src === 'file') {
            const url = new Url('./dashboard/file', {file: data.id});
            const response = await Http.DELETE(url);
            if(response.reason)
                return {error: response.reason};

            console.log(ImagesPanel.grids);
            ImagesPanel.grids.forEach(grid => grid.grid.remove(data.id));

            return {error: false}
        }

        if(state === PopupForm.RESULT && !data.close && data.src !== 'file') {

            const url = new Url('./dashboard/file/tag', {tag: data.src, file:data.id});
            const response = await Http.DELETE(url);
            if(response.reason)
                return {error: response.reason};

            const element = document.getElementById(`grid_item_${data.id}`);
            const tagList = element.getElementsByClassName('mod_grid_actives')[0];
            const child = [...tagList.childNodes].filter(child => child.getAttribute('tag-id') === data.src)[0];
            if(!child) return;
            tagList.removeChild(child);
        }

        return {error: false};
    }

    async onTagChange(state, data, popup) {
        if(state === PopupForm.CLICK) {
            popup.asList(window.tags);
        }
        if(state === PopupForm.RESULT && !data.close) {
            const url = new Url('./dashboard/file/tag', {tag: data.tag, file: data.id});
            const response = await Http.UPDATE(url);
            if(response.reason)
                return {error: response.reason};

            const element = document.getElementById(`grid_item_${data.id}`);
            const tagList = element.getElementsByClassName('mod_grid_actives')[0];
            let elemt = document.createElement('div');
            elemt.innerHTML = `
            <div tag-id="${data.tag}" file-id="${data.id}" class="mod_grid_active info remove" popup-data=".tag-id=src,.file-id=id,#Remove heroImage from file?=title,#Yes remove it=submit" data-info="Remove tag"><i class="fas fa-tag"></i><span>${data.tag}</span></div>
            `;
            elemt = elemt.firstElementChild;
            tagList.insertBefore(elemt, tagList.lastElementChild);
            this.registerInfo(elemt);
            this.remove.bindButton(elemt, this.onRemoveFile.bind(this));
        }
        return {error: false};
    }

    appendGrid(file) {
        const data = {
            id: 'images',
            itemId:file.name,
            contentStyle:`flex-direction:row;padding-top:1rem;padding-bottom:1rem;`,
            image:`center / contain no-repeat url('upload/${file.name}')`,
            content: `
            <div class="mod_grid_item_content">
                <h2>${file.name}</h2>
                <div class="mod_grid_actives">
                    <div file-id="${file.name}" class="mod_grid_active info trigger-list" popup-data=".file-id=id,#Add tag to file=title" data-info="Add tag"><i class="fas fa-plus"></i></div>
                </div>
            </div>
            <div class="grid_icons" id="${file.name}">
                <i class="grid_edit fas fa-trash-alt info remove" popup-data="<.id=id,#file=src,#Are you sure?=title,#Yes remove it=submit" data-info="Delete Image"></i>
            </div>`
        };
        ImagesPanel.grids.forEach(grid =>
        {
            console.log("grid: ", grid);
            const node = grid.grid.append(data);
            grid.panel.registerTrigger(node);
            grid.panel.remove.bindButton(node.getElementsByClassName('remove'), this.onRemoveFile.bind(this));
            grid.panel.listPopup.bindButton(node.getElementsByClassName('trigger-list'), this.onTagChange.bind(this));
            grid.listener(node);
        });
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
