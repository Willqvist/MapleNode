import express from 'express';
import DatabaseConnection from './core/database/DatabaseConnection';
import InstallationHandler from './setup/InstallationHandler';
import * as consts from './core/Constants';
import Logger from './core/logger/Logger';
import { DesignInterface, PalettesInterface, SettingsInterface } from './core/Interfaces/DatabaseInterfaces';
import { getConfig } from './core/config/Config';
import HOME from './Paths';
import { TaggedFile } from './core/Interfaces/Interfaces';
import FileProvider from './models/FileProvider';

function setConstants(settings: SettingsInterface, palette: PalettesInterface) {
  consts.setConstant('settings', settings);
  consts.setConstant('palette', palette);
}

export function setExpressRender() {
  const { render } = express.response;
  express.response.render = function (view, options?, callback?) {
    const opt = { options: { ...options } };
    opt.options.page = view;
    render.call(this, 'root', opt, callback);
  };
}

/**
 * sets up the server with constans and configs.
 * @param setupListeners callback to setup all listeners
 * @param setupComplete callback when the setup is complete.
 */
export default async function setup(setupListeners: () => void, setupComplete: () => void): Promise<void> {
  const installer = new InstallationHandler();
  await setupListeners();
  let data;
  const config = await getConfig();
  const { prefix } = config.server.database;
  try {
    data = await installer.getInstallerObject('/settings/setup.MN');
  } catch (err) {
    Logger.warn('debug', `To begin setup, visit .:${config.server.port}/setup`);
    return;
  }

  if (!data.mysqlSetupComplete) {
    Logger.warn('debug', `To begin setup, visit .:${config.server.port}/setup`);
    return;
  }

  if (prefix.length !== 0) {
    consts.setConstant('prefix', prefix);
    consts.setConstant('realPath', HOME);
    try {
      const settings = await DatabaseConnection.instance.getSettings();
      const palette = await DatabaseConnection.instance.getActivePalette();
      setConstants(settings, palette);
    } catch (err) {
      Logger.log('debug', err);
      return;
    }
  } else {
    Logger.warn('debug', `setup incomplete, visit .:${config.server.port}/setup`);
    data.mysqlSetupComplete = false;
    data.done = false;
    await installer.saveInstallerObject(data, '/settings/setup.MN');
    return;
  }

  if (!data.done) {
    Logger.warn('debug', `setup incomplete visit .:${config.server.port}/setup`);
    consts.setConstant('setup-status', -1);
    return;
  }

  return setupComplete();
}
