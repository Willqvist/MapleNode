import Panel from './Panel.js';
import PopupProvider from '../popup/PopupProvider.js';
import PopupForm from '../popup/PopupForm.js';
import Http from '../../API/Http.js';
import Url from '../../API/Url.js';

export default class VotePanel extends Panel {
  init() {
    const remove = PopupProvider.get('removePopup');
    remove.bindButton(this.getAll('remove'), this.onRemoveVote);
  }

  // eslint-disable-next-line class-methods-use-this
  async onRemoveVote(state, data) {
    if (state === PopupForm.RESULT && !data.close) {
      console.log('remove data: ', data);
      const url = new Url('./dashboard/vote/remove', {
        id: data.id,
      });
      const response = await Http.POST(url);
      return { error: response.reason };
    }
    return { error: false };
  }

  async onPopupClick(state, data) {
    if (state === PopupForm.RESULT && !data.close) {
      if (data.input_1.length === 0 || data.input_2.length === 0) {
        return { error: 'Please fill in all the fields!' };
      }
      let url;
      console.log(data);
      if (data.id === -1) {
        url = new Url('./dashboard/vote/add', {
          name: data.input_1,
          url: data.input_2,
          nx: data.input_3,
          time: data.input_4,
        });
      } else {
        url = new Url('./dashboard/vote/update', {
          key: data.id,
          name: data.input_1,
          url: data.input_2,
          nx: data.input_3,
          time: data.input_4,
        });
      }
      const response = await Http.POST(url);
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
