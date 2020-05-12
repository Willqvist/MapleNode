/* eslint no-empty-function: 0 */
/* eslint class-methods-use-this: 0 */
import PopupProvider from '../popup/PopupProvider.js';

export default class Panel {
  constructor(id) {
    this.id = id;
    this.DOM = document.getElementById(id);
    this.popups = {};
  }

  registerTriggers() {
    const cls = this.DOM.getElementsByClassName('popup-trigger');
    for (let i = 0; i < cls.length; i++) {
      const popup = PopupProvider.get(cls[i].getAttribute('trigger'));
      popup.bindButton(cls[i], this.onPopupClick);
    }
  }

  getAll(cls) {
    return this.DOM.getElementsByClassName(cls);
  }

  async onPopupClick(state, data) {}

  init() {}

  async onFocus() {}

  async onData(data) {}

  async onExit() {}
}
