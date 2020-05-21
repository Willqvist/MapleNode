/* eslint no-empty-function: 0 */
/* eslint class-methods-use-this: 0 */
import PopupProvider from '../popup/PopupProvider.js';

export default class Panel {
  constructor(id) {
    this.id = id;
    this.DOM = document.getElementById(id);
    this.popups = {};
    this.submenu = null;
    this.subMenuMap = {};
  }

  registerTriggers() {
    this.registerTrigger(this.DOM);
  }

  registerTrigger(elem) {
    const cls = elem.getElementsByClassName('popup-trigger');
    console.log(cls);
    for (let i = 0; i < cls.length; i++) {
      const popup = PopupProvider.get(cls[i].getAttribute('trigger'));
      popup.bindButton(cls[i], this.onPopupClick.bind(this));
    }
  }

  getAll(cls) {
    return this.DOM.getElementsByClassName(cls);
  }

  async onPopupClick(state, data) {
    return {error:null};
  }

  init() {}

  async onFocus() {}

  async onData(data) {}

  async onExit() {}
}