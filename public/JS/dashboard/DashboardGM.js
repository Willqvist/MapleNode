import PanelHandler from './panels/PanelHandler.js';
import StatisticsPanel from './panels/StatisticsPanel.js';
import ContentsPanel from "./panels/ContentsPanel.js";

const bar = document.getElementById('dahboard_bar');
const handler = new PanelHandler();
const statistics = new StatisticsPanel('statistics');
const contents = new ContentsPanel('contents');

handler.listen('pageEnter', (page, src) => {
  const offsetY = src.offsetTop - src.parentNode.offsetTop;
  bar.style.transform = `translate(0,${offsetY}px)`;
  console.log('entering page:', offsetY);
});

contents.registerTriggers();
handler.addPanel(statistics);
handler.addPanel(contents);
handler.bindMenu(document.getElementById('dashboard_menu_id'));
handler.goTo('statistics');
