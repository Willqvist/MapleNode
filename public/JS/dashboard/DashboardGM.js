import PanelHandler from './panels/PanelHandler.js';
import DownloadPanel from './panels/DownloadPanel.js';
import StatisticsPanel from './panels/StatisticsPanel.js';
import VotePanel from './panels/VotePanel.js';

const bar = document.getElementById('dahboard_bar');
const handler = new PanelHandler();
const statistics = new StatisticsPanel('statistics');
const dashboard = new StatisticsPanel('dashboard');
const votePanel = new VotePanel('vote');
const downloadPanel = new DownloadPanel('download');

handler.listen('pageEnter', (page, src) => {
  const offsetY = src.offsetTop - src.parentNode.offsetTop;
  bar.style.transform = `translate(0,${offsetY}px)`;
  console.log('entering page:', offsetY);
});

votePanel.registerTriggers();
downloadPanel.registerTriggers();
handler.addPanel(dashboard);
handler.addPanel(statistics);
handler.addPanel(downloadPanel);
handler.addPanel(votePanel);
handler.bindMenu(document.getElementById('dashboard_menu_id'));
handler.goTo('dashboard');
