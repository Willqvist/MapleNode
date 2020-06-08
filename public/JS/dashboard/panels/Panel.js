/* eslint no-empty-function: 0 */
/* eslint class-methods-use-this: 0 */
import PopupProvider from '../popup/PopupProvider.js';

export default class Panel {
  constructor(id) {
    this.id = id;
    this.DOM = document.getElementById(id);
    console.log(id, this.DOM);
    this.popups = {};
    this.submenu = null;
    this.subMenuMap = {};
    this.eventFuncs = {};
  }

  registerTriggers() {
    this.registerTrigger(this.DOM);
  }

  registerTrigger(elem) {
    this.registerInfo(elem);
    const cls = elem.getElementsByClassName('popup-trigger');
    for (let i = 0; i < cls.length; i++) {
      const popup = PopupProvider.get(cls[i].getAttribute('trigger'));
      popup.bindButton(cls[i], this.onPopupClick.bind(this));
    }
  }

  bindPanels() {
    const elems = this.getAll('panel-bind');
    for(let i = 0; i < elems.length; i++) {
      this.bindPanel(elems[i]);
    }
  }

  bindPanel(elem) {
    const method = elem.getAttribute('method');
    const event = elem.getAttribute('event');
    this.eventFuncs[elem] = () => {
      this[method](elem);
    };
    elem.addEventListener(event,this.eventFuncs[elem],false);
  }

  getAll(cls) {
    return this.DOM.getElementsByClassName(cls);
  }

  async onPopupClick(state, data, popup) {
    return {error:null};
  }

  registerInfo(elem) {
    const infos = [...elem.getElementsByClassName('info')];
    if(elem.className.includes('info'))
      infos.push(elem);

    for(let i = 0; i < infos.length; i++)
      window.registerInfo(infos[i]);
  }

  init() {}

  async onFocus() {}

  async onData(data) {}

  async onExit() {}
}
