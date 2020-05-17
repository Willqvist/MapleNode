import Panel from './Panel.js';
import Http from '../../API/Http.js';
import PopupProvider from '../popup/PopupProvider.js';
import PopupForm from '../popup/PopupForm.js';
import Url from '../../API/Url.js';
import List from "../../list.js";

export default class DownloadPanel extends Panel {
  init() {
    this.remove = PopupProvider.get('removePopup');
    this.remove.bindButton(this.getAll('remove'), this.onRemoveDownload.bind(this));
    super.init();
    this.list = new List("Downloads");
  }

  // eslint-disable-next-line class-methods-use-this
  async onRemoveDownload(state, data) {
    if (state === PopupForm.RESULT && !data.close) {
      console.log('remove data: ', data);
      const url = new Url('./dashboard/download/remove', {
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
      icon: 'fas fa-download',
      id: data.id,
      name: data.input_1,
      sublist:{url:data.input_2},
      buttons: [
        {
          icon:'far fa-edit',
          content:'',
          attribs:{
            class:'btn-icon info popup-trigger',
            trigger:'downloadPopup',
            'popup-data': '<.id=id,#Edit Vote=title,#Name=label_1,#Url=label_2,<<>div>div>p=input_1,<<>div>div[2]>ul>li>span=input_2,#Edit=submit',
            'data-info': 'Edit'
          }
        },
        {
          icon:'fas fa-trash-alt',
          content:'',
          attribs:{
            class:'btn-icon info popup-trigger remove',
            trigger:'removePopup',
            'popup-data': '<.id=id,#Are you sure?=title,#Yes remove it=submit',
            'data-info': 'Remove'
          }
        },
      ]
    }
    const node =  this.list.append(obj);
    this.registerTrigger(node);
    this.remove.bindButton(node.getElementsByClassName('remove'), this.onRemoveDownload.bind(this));
  }

  async onPopupClick(state, data) {
    super.onPopupClick(state, data);
    if (state === PopupForm.RESULT && !data.close) {
      if (data.input_1.length === 0 || data.input_2.length === 0) {
        return { error: 'Please fill in all the fields!' };
      }
      let response;
      let url;
      if (data.id === '-1') {
        url = new Url('./dashboard/download/add', {
          name: data.input_1,
          url: data.input_2,
        });
        response = await Http.POST(url);
        if(response.reason) return { error: response.reason };
        data.id = response.id;
        this.addList(data);
      } else {
        url = new Url('./dashboard/download/update', {
          key: data.id,
          name: data.input_1,
          url: data.input_2,
        });
        response = await Http.POST(url);
      }
      return { error: response.reason };
    }
    return { error: false };
  }

  async onExit() {
    // let dat = await Dialog.showYesNo("Are you sure?");
    super.onExit();
  }

  async onFocus() {
    super.onFocus();
  }
}
