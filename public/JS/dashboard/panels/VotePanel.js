import PopupForm from '../popup/PopupForm.js';
import Http from '../../API/Http.js';
import Url from '../../API/Url.js';
import Panel from "./Panel.js";
import List from "../../list.js";
import PopupProvider from "../popup/PopupProvider.js";

export default class VotePanel extends Panel{

  init() {
    super.init();
    this.voteList = new List("Votes");
    this.remove = PopupProvider.get('removePopup');
    this.remove.bindButton(this.getAll('remove'), this.onRemoveVote.bind(this));
  }

  // eslint-disable-next-line class-methods-use-this
  async onRemoveVote(state, data) {
    if (state === PopupForm.RESULT && !data.close) {
      console.log('remove data: ', data);
      const url = new Url('./dashboard/vote', {
        id: data.id,
      });
      const response = await Http.DELETE(url);
      if(response.reason || !response.success) return { error: response.reason };
      this.voteList.remove(data.id);
      return { error: response.reason };
    }
    return { error: false };
  }

  addList(list, data) {
    const obj = {
      icon: 'fas fa-poll',
      id: data.id,
      name: data.input_1,
      sublist:{url:data.input_2,nx:data.input_3,cooldown:data.input_4},
      buttons: [
        {
          icon:'far fa-edit',
          content:'',
          attribs:{
            class:'btn-icon info popup-trigger',
            trigger:'votePopup',
            'popup-data': '#vote=src,<.id=id,#Edit Vote=title,#Name=label_1,#Url=label_2,#Nx=label_3,#Cooldown=label_4,<<>div>div>p=input_1,<<>div>div[2]>ul>li>span=input_2,<<>div>div[2]>ul>li[1]>span=input_3,<<>div>div[2]>ul>li[2]>span=input_4,#Edit=submit',
            'data-info': 'Edit'
          }
        },
        {
          icon:'fas fa-plus',
          content:'',
          attribs:{
            class:'fa-trash-alt btn-icon info popup-trigger remove',
            trigger:'removePopup',
            'popup-data': '#vote=src,<.id=id,#Are you sure?=title,#Yes remove it=submit',
            'data-info': 'Remove'
          }
        },
      ]
    }
    const node = list.append(obj);
    this.registerTrigger(node);
    this.remove.bindButton(node.getElementsByClassName('remove'), this.onRemoveVote.bind(this));
    return node;
  }

  async onPopupClick(state, input) {
    const data = input;
    if (state === PopupForm.RESULT && !data.close) {
      if (data.input_1.length === 0 || data.input_2.length === 0) {
        return { error: 'Please fill in all the fields!' };
      }
      let url;
      let response;
      if (data.id === '-1') {
        url = new Url('./dashboard/vote', {
          name: data.input_1,
          url: data.input_2,
          nx: data.input_3,
          time: data.input_4,
        });
        response = await Http.POST(url);
        if(response.reason || !response.success) return { error: response.reason };
        data.id = response.id;
        this.addList(this.voteList,data);
        return { response };
      }
      url = new Url('./dashboard/vote', {
        key: data.id,
        name: data.input_1,
        url: data.input_2,
        nx: data.input_3,
        time: data.input_4,
      });
      response = await Http.UPDATE(url);
      return { error: response.reason };
    }
    return { error: false };
  }

  async onExit() {
    super.onExit();
  }

  async onFocus() {
    super.onFocus();
  }
}
