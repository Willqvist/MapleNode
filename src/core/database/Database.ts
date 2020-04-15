import {
    AccountsInterface,
    CharactersInterface,
    DesignInterface,
    DownloadsInterface, LayoutInterface,
    PalettesInterface,
    SettingsInterface, VoteInterface
} from "../Interfaces/DatabaseInterfaces";
import { EquipmentInterface } from "../Interfaces/Interfaces";

export interface SWO {
    select?:string[];
    where?:object;
    order?:object
}

export interface Error {
    errorCode: number;
    errorMsg: string;
}

export interface Database {
    onInstansiate(data : object) : Promise<boolean>;
    getSettings(obj?: SWO) : Promise<SettingsInterface>;
    getCharacter(name :string, obj?: SWO) : Promise<CharactersInterface>;
    getDesign(obj?: SWO) : Promise<DesignInterface>;
    getActivePalette(obj?: SWO) : Promise<PalettesInterface>;
    getDownloads(obj?: SWO) : Promise<DownloadsInterface>;
    getVotes(obj?: SWO) : Promise<VoteInterface[]>;
    getVote(id: number, obj?: SWO) : Promise<VoteInterface>;
    getPalette(name : string, obj?: SWO) : Promise<PalettesInterface>;
    getLayout(name: string, obj?: SWO) : Promise<LayoutInterface>;
    getEquipment(character : number) : Promise<EquipmentInterface[]>;
    loadRank(searchFlag,page: number,order: number) : Promise<any>;
    getAccount(name: string,obj?: SWO) : Promise<AccountsInterface>;
    addAccount(name: string,password: string,birthday: string,email: string) : Promise<boolean>;
    addVoting(accountid: number, voteid: number) : Promise<boolean>;
    addVote(name: string,url: string,nx: number,time: number) : Promise<boolean>;
    deleteVote(id: number) : Promise<boolean>;
    enablePalette(id: number) : Promise<boolean>;
    deletePalette(id: number) : Promise<boolean>;
    updateHeroImage(heroImage: string) : Promise<boolean>;
    updateLogo(logo: string) : Promise<boolean>;
    updateDownload(id,name: string,url: string) : Promise<boolean>;
    deleteDownload(id) : Promise<boolean>;
    addDownload(name: string,url: string) : Promise<boolean>;
    updateLayout(name: string,json: string) : Promise<boolean>;
    rebuildDatabase(prefix: string) : Promise<boolean>;
    addDesign(heroImage: string,logo: string) : Promise<boolean>;

    addPalette(name: string,mainColor: string,secondaryMainColor: string,fontColorDark: string,
               fontColorLight: string,fillColor: string,active: number) : Promise<boolean>;

    updatePalette(id: number,mainColor: string,secondaryMainColor: string,fontColorDark: string,
                  fontColorLight: string,fillColor: string) : Promise<boolean>;

    addSettings(serverName: string,version: string,expRate: string,dropRate: string,mesoRate: string,
                nxColumn: string,vpColumn: string,gmLevel: number) : Promise<boolean>;

    printError(errno: number);

}

/*
json layout
{
    select:[]
    where:{a:2}
    order:{a:asc}
 */
export enum RANK {
    JOB=1,
    NAME,
}

export enum ACCOUNT_FLAGS {
    voting=1
}
