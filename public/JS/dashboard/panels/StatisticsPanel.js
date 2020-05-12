import Panel from './Panel.js';

export default class StatisticsPanel extends Panel {
  init() {
    super.init();
    console.log('init');
  }

  async onPopupClick(state, data) {
    super.onPopupClick(state, data);
    console.log('click: ', state);
  }

  async onExit() {
    super.onExit();
  }

  async onFocus() {
    super.onFocus();
    console.log('focusing');
  }
}
