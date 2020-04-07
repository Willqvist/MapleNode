const mysql = require("mysql");
class Database {

    async onInstansiate(data) {}
    async getSettings(obj) {}
    async getDesign(obj) {}
    async getActivePalette(obj) {}
    async getDownloads(obj) {}
    async getVotes(obj) {}
    async getPlayer(obj) {}
    async getVote(obj) {}
    async getPalette(obj) {}
    async getLayout(obj) {}
    async loadRank(searchFlag,page,order) {}
    async getUser(name,password) {}
    async addAccount(name,password,birthday,email) {}
    async getAccount(name,flags) {}
    async addVoting(accountid, voteid) {}
    async addVote(name,url,nx,time) {}
    async deleteVote(id) {}
    async addPalette(name,mainColor,secondaryMainColor,fontColorDark,fontColorLight,fillColor,active) {}
    async enablePalette(id) {}
    async deletePalette(id) {}
    async updatePalette(id,mainColor,secondaryMainColor,fontColorDark,fontColorLight,fillColor) {}
    async updateHeroImage(heroImage) {}
    async updateLogo(logo) {}
    async updateDownload(id,name,url) {}
    async deleteDownload(id) {}
    async addDownload(name,url) {}
    async updateLayout(name,json) {}
    async rebuildDatabase(prefix) {}
    async addDesign(heroImage,logo) {}
    async addSettings(serverName,version,expRate,dropRate,mesoRate,nxColumn,vpColumn,gmLevel) {}

}

/*
json layout
{
    select:[]
    where:{a:2}
    order:{a:asc}
 */
RANK = {
    JOB:1,
    NAME:2,
}

ACCOUNT_FLAGS = {
    voting: 1,
}

module.exports = Database;