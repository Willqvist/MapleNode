import { Database } from '../database/Database';
import Logger from '../logger/Logger';
import ConfigParser from './ConfigParser';
import { DatabaseAuthInterface } from '../Interfaces/Interfaces';
import ConfigFile from './ConfigFile';
import FileTools from '../tools/FileTools';

export interface ConfigInterface {
  server: {
    database: {
      instance: Database;
      auth: DatabaseAuthInterface;
      prefix: string;
    };
    port: number;
  };
  run: RunInterface;
}
export interface RunInterface {
  mode: string;
  showError: boolean;
  template: string;
}

let config: ConfigInterface;
export let configParser: ConfigParser;
let configFile: ConfigFile;

async function writeDefault() {
  const str = `{
    "server": {
    "database": {
        "instance": "MysqlDatabase",
        "auth": {
            "user": "",
            "password": "",
            "host": "",
            "database": ""
        },
        "prefix": ""
    },
    "port": 80
},
    "run": {
        "mode": "debug",
        "showError": true,
        "template": "MapleNode"
    }
}       
`;
  await FileTools.write('./nodeconfig.json', str);
  return str;
}

async function applyParsers(obj: ConfigParser) {
  const database = obj.member('server/database');
  try {
    const db = await database.import<Database>('instance', 'core/database/mysql/');
    const auth = await database.interface<DatabaseAuthInterface>('auth');
    const prefix = await obj.string('server/database/prefix');
    config.server.database = {
      instance: db,
      auth,
      prefix,
    };
  } catch (err) {
    Logger.error('error', err.message);
  }
  config.run = await obj.interface<RunInterface>('run');
  config.server.port = await obj.number('server/port');
}

export async function getConfig(): Promise<ConfigInterface> {
  if (config != null) return config;
  let content;
  try {
    content = await FileTools.readFile('./nodeconfig.json', 'utf8');
  } catch (err) {
    content = await writeDefault();
  }
  const file = JSON.parse(content);
  config = JSON.parse(content);
  configParser = new ConfigParser(file);
  await applyParsers(configParser);
  configFile = new ConfigFile(config, file);
  return config;
}

export async function openConfig(): Promise<ConfigFile> {
  if (!config) await getConfig();
  return configFile;
}
