import Http from '../../API/Http.js';
import PopupForm from '../popup/PopupForm.js';
import Url from '../../API/Url.js';

export default class DownloadPanel {
  // eslint-disable-next-line class-methods-use-this
  async onRemoveDownload(state, data) {
    if (state === PopupForm.RESULT && !data.close) {
      const url = new Url('./dashboard/download/remove', {
        id: data.id,
      });
      const response = await Http.POST(url);
      return { error: response.reason };
    }
    return { error: false };
  }

  addList(list, data) {
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
            'popup-data': '#download=src,<.id=id,#Edit Vote=title,#Name=label_1,#Url=label_2,<<>div>div>p=input_1,<<>div>>div[2]ul>li>span=input_2,#Edit=submit',
            'data-info': 'Edit'
          }
        },
        {
          icon:'fas fa-trash-alt',
          content:'',
          attribs:{
            class:'btn-icon info popup-trigger remove',
            trigger:'removePopup',
            'popup-data': '#download=src,<.id=id,#Are you sure?=title,#Yes remove it=submit',
            'data-info': 'Remove'
          }
        },
      ]
    }
    const node =  list.append(obj);
    return node;
    // this.registerTrigger(node);
    // this.remove.bindButton(node.getElementsByClassName('remove'), this.onRemoveDownload.bind(this));
  }

  async onPopupClick(state, input) {
    const data = input;
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
        return { response };
      }
      url = new Url('./dashboard/download/update', {
        key: data.id,
        name: data.input_1,
        url: data.input_2,
      });
      response = await Http.POST(url);
      return { error: response.reason, response };
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
