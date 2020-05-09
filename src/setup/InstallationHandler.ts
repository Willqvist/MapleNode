import * as fs from 'fs';
import * as constants from '../core/Constants';
import DBConn from '../core/database/DatabaseConnection';
import { PalettesInterface, SettingsInterface } from '../core/Interfaces/DatabaseInterfaces';
import HOME from '../Paths';
import Errno from '../core/tools/Errno';

export interface InstallerI {
  mysqlSetupComplete: boolean;
  settingsComplete: boolean;
  done: boolean;
}

export default class InstallationHandler {
  installObj: InstallerI = null;

  async installationComplete(src: string): Promise<InstallerI> {
    return new Promise<InstallerI>((resolve, reject) => {
      if (this.installObj) {
        resolve(this.installObj);
      } else {
        fs.access(HOME + src, fs.constants.F_OK, (err) => {
          const data: InstallerI = {
            mysqlSetupComplete: false,
            done: false,
            settingsComplete: false,
          };
          this.installObj = data;
          if (!err) {
            fs.readFile(HOME + src, 'utf8', (errRead, text) => {
              if (errRead) reject(errRead);
              try {
                const jsonText = JSON.parse(text);
                const ret: InstallerI = {
                  mysqlSetupComplete: jsonText.mysqlSetupComplete,
                  done: jsonText.done,
                  settingsComplete: jsonText.settingsComplete,
                };
                this.installObj = ret;
                resolve(ret);
              } catch (errThrow) {
                fs.writeFile(HOME + src, JSON.stringify(data), { flag: 'w' }, (errWrite) => {
                  if (errWrite) reject(errWrite);
                  this.installObj = data;
                  resolve(data);
                });
              }
            });
          } else {
            fs.writeFile(HOME + src, JSON.stringify(data), { flag: 'wx' }, (errWrite) => {
              if (errWrite) reject(errWrite);
              resolve(data);
            });
          }
        });
      }
    });
  }

  async setMysqlSetupComplete(userData) {
    constants.setConstant('prefix', userData.prefix);
    await DBConn.instance.rebuildDatabase(userData.prefix);
    await DBConn.instance.addPalette('Happy Green', '#69DC9E', '#3E78B2', '#D3F3EE', '#20063B', '#CC3363', 1);
    await DBConn.instance.addDesign('headerImage.png', 'svgs/logo.svg');
    await DBConn.instance.updateLayout(
      'home',
      '{"0":{"name":"info_box","panel":"none","columns":{"pos":1,"size":7},"rows":{"pos":1,"size":6}},"1":{"name":"control_box","panel":"none","columns":{"pos":7,"size":10},"rows":{"pos":1,"size":4}},"2":{"name":"news_box","panel":"none","columns":{"pos":1,"size":7},"rows":{"pos":6,"size":8}},"3":{"name":"server_box","panel":"none","columns":{"pos":7,"size":10},"rows":{"pos":4,"size":8}},"4":{"name":"stats_box","panel":"none","columns":{"pos":1,"size":10},"rows":{"pos":8,"size":10}},"5":{"name":"ranking_box","panel":"none","columns":{"pos":1,"size":10},"rows":{"pos":10,"size":14}}}'
    );

    const paletteInterface: PalettesInterface = {
      name: 'Happy Green',
      mainColor: '#69DC9E',
      secondaryMainColor: '#3E78B2',
      fontColorLight: '#D3F3EE',
      fontColorDark: '#20063B',
      fillColor: '#CC3363',
    };

    constants.setConstant('palette', paletteInterface);
    await this.saveInstallerObject({ done: false, settingsComplete: false, mysqlSetupComplete: true });
  }

  async saveSettings(settings: SettingsInterface, setup: string, client: string, src: string = '/settings/setup.MN') {
    try {
      await DBConn.instance.addSettings(
        settings.serverName,
        settings.version,
        settings.expRate,
        settings.dropRate,
        settings.mesoRate,
        settings.nxColumn,
        settings.vpColumn,
        settings.gmLevel
      );
      await DBConn.instance.addDownload('Setup', setup);
      await DBConn.instance.addDownload('Client', client);

      const data: InstallerI = await this.getInstallerObject(src);
      data.settingsComplete = true;
      await this.saveInstallerObject(data);
    } catch (err) {
      console.log(err);
    }
  }

  async setupComplete(src: string = '/settings/setup.MN') {
    const data: InstallerI = await this.getInstallerObject(HOME + src);
    data.done = true;
    await this.saveInstallerObject(data);
  }

  saveInstallerObject(data: InstallerI, src: string = '/settings/setup.MN') {
    this.installObj = data;
    return new Promise((resolve, reject) => {
      fs.writeFile(HOME + src, JSON.stringify(data), (err) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  async getInstallerObject(src: string): Promise<InstallerI> {
    return this.installationComplete(src);
  }
}

export function getInstallErrors(error: Errno): string {
  switch (error.errno) {
    case 'ECONNREFUSED':
      return 'connection refused.. is mysql on?';
    case 'ENOTFOUND':
      return 'Could not connect to host';
    case 'ER_ACCESS_DENIED_ERROR':
      return 'Wrong username or password';
    case 'ER_BAD_DB_ERROR':
      return 'Could not find database';
    default:
      return error.msg;
  }
}
