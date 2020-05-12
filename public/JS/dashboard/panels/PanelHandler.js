export default class PanelHandler {
  constructor() {
    this.panels = {};
    this.activePanel = null;
    this.menu = null;
  }

  addPanel(panel) {
    this.panels[panel.id] = panel;
    panel.init();
  }

  goTo(id) {
    if (this.menu) {
      this.menu[id].icon.className = 'fas fa-circle-notch fa-spin';
    }
    if (this.activePanel != null) {
      this.activePanel.DOM.style.display = 'none';
      const old = this.activePanel;
      this.activePanel = this.panels[id];
      old.onExit().then(() => {
        this.activePanel.onFocus().then(() => {
          this.activePanel.DOM.style.display = 'flex';
          if (this.menu) {
            this.menu[id].icon.className = this.menu[id].className;
          }
        });
      });
    } else {
      this.activePanel = this.panels[id];
      this.activePanel.onFocus().then(() => {
        this.activePanel.DOM.style.display = 'flex';
        if (this.menu) {
          this.menu[id].icon.className = this.menu[id].className;
        }
      });
    }
  }

  bindMenu(menu) {
    const lis = menu.getElementsByTagName('li');
    this.menu = {};
    for (let i = 0; i < lis.length; i++) {
      const page = lis[i].getAttribute('page');
      const icon = lis[i].getElementsByTagName('i')[0];
      this.menu[page] = {
        DOM: lis[i],
        icon,
        className: icon.className,
      };
      lis[i].addEventListener(
        'click',
        () => {
          this.goTo(page);
        },
        false
      );
    }
  }
}
