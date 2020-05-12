import PopupForm from './PopupForm.js';

export default class PopupProvider {
  static get(id) {
    if (!PopupProvider.popups[id]) {
      PopupProvider.popups[id] = new PopupForm(id);
    }
    return PopupProvider.popups[id];
  }
}
PopupProvider.popups = {};
PopupProvider.instances = 0;
