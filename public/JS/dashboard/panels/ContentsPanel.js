import Panel from './Panel.js';
import List from "../../list.js";
import Http from '../../API/Http.js';
import PopupProvider from '../popup/PopupProvider.js';
import PopupForm from '../popup/PopupForm.js';
import Url from '../../API/Url.js';
import DownloadPanel from "./DownloadPanel.js";
import VotePanel from "./VotePanel.js";

export default class ContentsPanel extends Panel {

    init() {
        this.download = new DownloadPanel();
        this.vote = new VotePanel();
        this.remove = PopupProvider.get('removePopup');
        this.remove.bindButton(this.getAll('remove'), this.onRemoveContents.bind(this));
        super.init();
        this.voteList = new List("Votes");
        this.downloadList = new List("Downloads");
    }

    async removeOnMatchValue(state,data,match,method,list) {
        if(data.src === match) {
            const { error } = await method(state, data);
            if(error) return {error};
            list.remove(data.id);
        }
    }

    async callClickMatchValue(state, value, match, panel, list) {
        const data = value;
        if(data.src !== match) return;
        const { error, response } = await panel.onPopupClick(state, {...data});
        if(error) return {error};
        console.log(data);
        if(data.id === '-1') {
            data.id = response.id;
            const node = panel.addList(list, data);
            this.registerTrigger(node);
            this.remove.bindButton(node.getElementsByClassName('remove'), this.onRemoveContents.bind(this));
        }
    }

    async onRemoveContents(state, data) {
        console.log(state, data);
        this.removeOnMatchValue(state,data,'download',this.download.onRemoveDownload,this.downloadList);
        this.removeOnMatchValue(state,data,'vote',this.vote.onRemoveVote,this.voteList);
        return {error:false};
    }

    async onPopupClick(state, input) {
        const data = input;
        console.log(data);
        if(!data.close) {
            this.callClickMatchValue(state,data,'download',this.download, this.downloadList);
            this.callClickMatchValue(state,data,'vote', this.vote, this.voteList);
        }
        return {error:false};
    }
}
