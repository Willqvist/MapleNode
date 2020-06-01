import PanelHandler from './panels/PanelHandler.js';
import StatisticsPanel from './panels/StatisticsPanel.js';
import LogsPanel from "./panels/LogsPanel.js";
import ReportsPanel from "./panels/ReportsPanel.js";
import PalettePanel from "./panels/PalettePanel.js";
import LayoutPanel from "./panels/LayoutPanel.js";
import DownloadPanel from "./panels/DownloadPanel.js";
import VotePanel from "./panels/VotePanel.js";
import ImagesPanel from "./panels/ImagesPanel.js";

const bar = document.getElementById('dahboard_bar');
const handler = new PanelHandler();
const statistics = new StatisticsPanel('statistics');
const layouts = new LayoutPanel('layouts');
const logs = new LogsPanel('logs');
const reports = new ReportsPanel('reports');

// Sub panels
const download = new DownloadPanel('downloads');
const vote = new VotePanel('votes');
const template = new StatisticsPanel('templates');
const image = new ImagesPanel('images');
const palettes = new PalettePanel('palettes');

handler.listen('pageEnter', (page, src) => {
  console.log(page.DOM.className.includes("containsSubPages"));
  const offsetY = src.offsetTop - src.parentNode.offsetTop;
  bar.style.transform = `translate(0,${offsetY}px)`;
  if(page.DOM.className.includes("containsSubPages")) {
    bar.className = "subPageFocus";
  } else {
    bar.className = "";
  }
});

download.registerTriggers();
vote.registerTriggers();
const submenuContents = handler.createSubMenu('contents');
submenuContents.addPanel(download);
submenuContents.addPanel(vote);
submenuContents.goTo('downloads');

const submenuDesignContents = handler.createSubMenu('designs');
submenuDesignContents.addPanel(template);
submenuDesignContents.addPanel(image);
submenuDesignContents.addPanel(palettes);
submenuDesignContents.goTo('palettes');

handler.addPanel(statistics);
handler.addPanel(layouts);
handler.addPanel(logs);
handler.addPanel(reports);
handler.bindMenu(document.getElementById('dashboard_menu_id'));
handler.goTo('logs');
