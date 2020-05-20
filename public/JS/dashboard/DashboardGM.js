import PanelHandler from './panels/PanelHandler.js';
import StatisticsPanel from './panels/StatisticsPanel.js';
import ContentsPanel from "./panels/ContentsPanel.js";
import LogsPanel from "./panels/LogsPanel.js";
import ReportsPanel from "./panels/ReportsPanel.js";
import DesignPanel from "./panels/DesignPanel.js";
import LayoutPanel from "./panels/LayoutPanel.js";

const bar = document.getElementById('dahboard_bar');
const handler = new PanelHandler();
const statistics = new StatisticsPanel('statistics');
const contents = new ContentsPanel('contents');
const designs = new DesignPanel('designs');
const layouts = new LayoutPanel('layouts');
const logs = new LogsPanel('logs');
const reports = new ReportsPanel('reports');

handler.listen('pageEnter', (page, src) => {
  console.log(page.DOM.className.includes("containsSubPages"));
  const offsetY = src.offsetTop - src.parentNode.offsetTop;
  bar.style.transform = `translate(0,${offsetY}px)`;
  if(page.DOM.className.includes("containsSubPages")) {
    bar.className = "subPageFocus";
  } else {
    bar.className = "";
  }
  console.log('entering page:', offsetY);
});

contents.registerTriggers();
handler.addPanel(statistics);
handler.addPanel(contents);
handler.addPanel(designs);
handler.addPanel(layouts);
handler.addPanel(logs);
handler.addPanel(reports);
handler.bindMenu(document.getElementById('dashboard_menu_id'));
handler.goTo('designs');
