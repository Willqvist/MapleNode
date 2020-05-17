import Panel from './Panel.js';
import PopupProvider from '../popup/PopupProvider.js';
import PopupForm from '../popup/PopupForm.js';
import Http from '../../API/Http.js';
import Url from '../../API/Url.js';
import List from "../../list.js";

export default class VotePanel extends Panel {
  init() {
    this.remove = PopupProvider.get('removePopup');
    this.remove.bindButton(this.getAll('remove'), this.onRemoveVote.bind(this));
    this.list = new List('Votes');
  }

  // eslint-disable-next-line class-methods-use-this
  async onRemoveVote(state, data) {
    if (state === PopupForm.RESULT && !data.close) {
      console.log('remove data: ', data);
      const url = new Url('./dashboard/vote/remove', {
        id: data.id,
      });
      this.list.remove(data.id);
      const response = await Http.POST(url);
      return { error: response.reason };
    }
    return { error: false };
  }

  addList(data) {
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
            'popup-data': '<.id=id,#Edit Vote=title,#Name=label_1,#Url=label_2,#Nx=label_3,#Cooldown=label_4,<<>div>div>p=input_1,<<>div>div[2]>ul>li>span=input_2,<<>div>div[2]>ul>li[1]>span=input_3,<<>div>div[2]>ul>li[2]>span=input_4,#Edit=submit',
            'data-info': 'Edit'
          }
        },
        {
          icon:'fas fa-plus',
          content:'',
          attribs:{
            class:'fa-trash-alt btn-icon info popup-trigger remove',
            trigger:'removePopup',
            'popup-data': '<.id=id,#Are you sure?=title,#Yes remove it=submit',
            'data-info': 'Remove'
          }
        },
      ]
    }
    const node =  this.list.append(obj);
    this.registerTrigger(node);
    this.remove.bindButton(node.getElementsByClassName('remove'), this.onRemoveVote.bind(this));
  }

  async onPopupClick(state, data) {
    if (state === PopupForm.RESULT && !data.close) {
      if (data.input_1.length === 0 || data.input_2.length === 0) {
        return { error: 'Please fill in all the fields!' };
      }
      let url;
      let response;
      console.log(data);
      if (data.id === '-1') {
        url = new Url('./dashboard/vote/add', {
          name: data.input_1,
          url: data.input_2,
          nx: data.input_3,
          time: data.input_4,
        });
        response = await Http.POST(url);
        if(response.reason) return { error: response.reason };
        data.id = response.id;
        this.addList(data);
      } else {
        url = new Url('./dashboard/vote/update', {
          key: data.id,
          name: data.input_1,
          url: data.input_2,
          nx: data.input_3,
          time: data.input_4,
        });
        response = await Http.POST(url);
      }
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
