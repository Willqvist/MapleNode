import * as fs from 'fs';

export interface SetupInterface {
  mysqlSetupComplete: boolean;
  prefix?: string;
  done: boolean;
}

export interface PartsInterface {
  face?: number;
  hair?: number;
  skincolor?: number;
  cap?: number;
  mask?: number;
  eyes?: number;
  ears?: number;
  coat?: number;
  pants?: number;
  shoes?: number;
  glove?: number;
  cape?: number;
  shield?: number;
  weapon?: number;
  stand?: number;
}

export interface DatabaseAuthInterface {
  host: string;
  user: string;
  password: string;
  database: string;
}

export interface EquipmentInterface {
  itemid: number;
  position: number;
}

export interface File {
  fileName: string;
  mimetype: string | false;
  destName: string;
  dirent?: fs.Dirent;
}

export interface TaggedFile extends File {
  tags: string[];
}
