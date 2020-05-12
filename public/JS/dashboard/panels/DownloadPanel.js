import Panel from './Panel.js';
import Http from '../../API/Http.js';
import PopupProvider from '../popup/PopupProvider.js';
import PopupForm from '../popup/PopupForm.js';
import Url from '../../API/Url.js';

export default class DownloadPanel extends Panel {
  init() {
    const remove = PopupProvider.get('removePopup');
    remove.bindButton(this.getAll('remove'), this.onRemoveDownload);
    super.init();
  }

  // eslint-disable-next-line class-methods-use-this
  async onRemoveDownload(state, data) {
    if (state === PopupForm.RESULT && !data.close) {
      console.log('remove data: ', data);
      const url = new Url('./dashboard/download/remove', {
        id: data.id,
      });
      const response = await Http.POST(url);
      return { error: response.reason };
    }
    return { error: false };
  }

  async onPopupClick(state, data) {
    super.onPopupClick(state, data);
    if (state === PopupForm.RESULT && !data.close) {
      if (data.input_1.length === 0 || data.input_2.length === 0) {
        return { error: 'Please fill in all the fields!' };
      }
      let url;
      if (data.id === -1) {
        url = new Url('./dashboard/download/add', {
          name: data.input_1,
          url: data.input_2,
        });
      } else {
        url = new Url('./dashboard/download/update', {
          key: data.id,
          name: data.input_1,
          url: data.input_2,
        });
      }
      const response = await Http.POST(url);
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
