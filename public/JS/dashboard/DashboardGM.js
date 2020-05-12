import PanelHandler from './panels/PanelHandler.js';
import DownloadPanel from './panels/DownloadPanel.js';
import StatisticsPanel from './panels/StatisticsPanel.js';
import VotePanel from './panels/VotePanel.js';

const handler = new PanelHandler();
const statistics = new StatisticsPanel('statistics');
const votePanel = new VotePanel('vote');
const downloadPanel = new DownloadPanel('download');
votePanel.registerTriggers();

downloadPanel.registerTriggers();
handler.addPanel(statistics);
handler.addPanel(downloadPanel);
handler.addPanel(votePanel);
handler.bindMenu(document.getElementById('dashboard_menu_id'));
handler.goTo('vote');
