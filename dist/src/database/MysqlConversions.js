"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NUMBER = (val) => val ? parseInt(val) : -1;
const STRING = (val) => val ? val : "";
const DATE = (val) => val;
const OBJECT = (val) => JSON.parse(val);
exports.accountsConversion = {
    id: NUMBER,
    name: STRING,
    password: STRING,
    salt: STRING,
    loggedin: NUMBER,
    lastlogin: DATE,
    createdat: DATE,
    birthday: DATE,
    banned: NUMBER,
    banreason: STRING,
    gm: NUMBER,
    email: STRING,
    emailcode: STRING,
    forumaccid: NUMBER,
    macs: STRING,
    lastpwemail: DATE,
    tempban: DATE,
    greason: NUMBER,
    paypalNX: NUMBER,
    mPoints: NUMBER,
    cardNX: NUMBER,
    donatorPoints: NUMBER,
    guest: NUMBER,
    LastLoginInMilliseconds: NUMBER,
    LeaderPoints: NUMBER,
    pqPoints: NUMBER,
    lastknownip: STRING,
    pin: STRING,
    NomePessoal: STRING,
    fb: STRING,
    twt: STRING,
    BetaPoints: NUMBER,
    sitelogged: STRING,
    webadmin: NUMBER,
    nick: STRING,
    mute: NUMBER,
    ip: STRING
};
exports.allianceConversion = {
    id: NUMBER,
    name: STRING,
    notice: STRING,
    capacity: NUMBER,
    rank_title1: STRING,
    rank_title2: STRING,
    rank_title3: STRING,
    rank_title4: STRING,
    rank_title5: STRING,
    guild1: NUMBER,
    guild2: NUMBER,
    guild3: NUMBER,
    guild4: NUMBER,
    guild5: NUMBER
};
exports.bosslogConversion = {
    bosslogid: NUMBER,
    characterid: NUMBER,
    bossid: STRING,
    lastattempt: DATE
};
exports.buddiesConversion = {
    id: NUMBER,
    characterid: NUMBER,
    buddyid: NUMBER,
    pending: NUMBER
};
exports.cashshopConversion = {
    sn: NUMBER,
    arg1: NUMBER,
    arg2: NUMBER,
    arg3: NUMBER
};
exports.channelconfigConversion = {
    channelconfigid: NUMBER,
    channelid: NUMBER,
    name: STRING,
    value: STRING
};
exports.channelsConversion = {
    channelid: NUMBER,
    world: NUMBER,
    number: NUMBER,
    key: STRING
};
exports.charactersConversion = {
    id: NUMBER,
    accountid: NUMBER,
    world: NUMBER,
    name: STRING,
    level: NUMBER,
    exp: NUMBER,
    str: NUMBER,
    dex: NUMBER,
    luk: NUMBER,
    int: NUMBER,
    hp: NUMBER,
    mp: NUMBER,
    maxhp: NUMBER,
    maxmp: NUMBER,
    meso: NUMBER,
    hpApUsed: NUMBER,
    mpApUsed: NUMBER,
    job: NUMBER,
    skincolor: NUMBER,
    gender: NUMBER,
    fame: NUMBER,
    hair: NUMBER,
    face: NUMBER,
    ap: NUMBER,
    sp: NUMBER,
    map: NUMBER,
    spawnpoint: NUMBER,
    gm: NUMBER,
    party: NUMBER,
    buddyCapacity: NUMBER,
    createdate: DATE,
    rank: NUMBER,
    rankMove: NUMBER,
    jobRank: NUMBER,
    jobRankMove: NUMBER,
    guildid: NUMBER,
    guildrank: NUMBER,
    allianceRank: NUMBER,
    messengerid: NUMBER,
    messengerposition: NUMBER,
    reborns: NUMBER,
    pvpkills: NUMBER,
    pvpdeaths: NUMBER,
    clan: NUMBER,
    mountlevel: NUMBER,
    mountexp: NUMBER,
    mounttiredness: NUMBER,
    married: NUMBER,
    partnerid: NUMBER,
    cantalk: NUMBER,
    zakumlvl: NUMBER,
    marriagequest: NUMBER,
    omok: NUMBER,
    matchcard: NUMBER,
    omokwins: NUMBER,
    omoklosses: NUMBER,
    omokties: NUMBER,
    matchcardwins: NUMBER,
    matchcardlosses: NUMBER,
    matchcardties: NUMBER,
    MerchantMesos: NUMBER,
    HasMerchant: NUMBER,
    gmtext: NUMBER,
    equipslots: NUMBER,
    useslots: NUMBER,
    setupslots: NUMBER,
    etcslots: NUMBER,
    bosspoints: NUMBER,
    bossrepeats: NUMBER,
    nextBQ: NUMBER,
    LeaderPoints: NUMBER,
    pqPoints: NUMBER,
    votePoints: NUMBER,
    occupation: NUMBER,
    jqpoints: NUMBER,
    CashPoints: NUMBER,
    jqrank: NUMBER,
    webhide: NUMBER
};
exports.charactersonlineConversion = {
    id: NUMBER,
    characterName: STRING,
    date: DATE
};
exports.cheatlogConversion = {
    id: NUMBER,
    characterid: NUMBER,
    offense: STRING,
    count: NUMBER,
    lastoffensetime: DATE,
    param: STRING
};
exports.cooldownsConversion = {
    id: NUMBER,
    charid: NUMBER,
    SkillID: NUMBER,
    length: NUMBER,
    StartTime: NUMBER
};
exports.dueyitemsConversion = {
    id: NUMBER,
    PackageId: NUMBER,
    itemid: NUMBER,
    quantity: NUMBER,
    upgradeslots: NUMBER,
    level: NUMBER,
    str: NUMBER,
    dex: NUMBER,
    int: NUMBER,
    luk: NUMBER,
    hp: NUMBER,
    mp: NUMBER,
    watk: NUMBER,
    matk: NUMBER,
    wdef: NUMBER,
    mdef: NUMBER,
    acc: NUMBER,
    avoid: NUMBER,
    hands: NUMBER,
    speed: NUMBER,
    jump: NUMBER,
    owner: STRING
};
exports.dueypackagesConversion = {
    PackageId: NUMBER,
    RecieverId: NUMBER,
    SenderName: STRING,
    Mesos: NUMBER,
    TimeStamp: STRING,
    Checked: NUMBER,
    Type: NUMBER
};
exports.engagementsConversion = {
    engagementid: NUMBER,
    husbandid: NUMBER,
    wifeid: NUMBER
};
exports.eventstatsConversion = {
    eventstatid: NUMBER,
    event: STRING,
    instance: STRING,
    characterid: NUMBER,
    channel: NUMBER,
    time: DATE
};
exports.famelogConversion = {
    famelogid: NUMBER,
    characterid: NUMBER,
    characterid_to: NUMBER,
    when: DATE
};
exports.gmlogConversion = {
    id: NUMBER,
    cid: NUMBER,
    command: STRING,
    when: DATE
};
exports.guildsConversion = {
    guildid: NUMBER,
    allianceId: NUMBER,
    leader: NUMBER,
    GP: NUMBER,
    logo: NUMBER,
    logoColor: NUMBER,
    name: STRING,
    rank1title: STRING,
    rank2title: STRING,
    rank3title: STRING,
    rank4title: STRING,
    rank5title: STRING,
    capacity: NUMBER,
    logoBG: NUMBER,
    logoBGColor: NUMBER,
    notice: STRING,
    signature: NUMBER
};
exports.hiredmerchantConversion = {
    id: NUMBER,
    ownerid: NUMBER,
    itemid: NUMBER,
    quantity: NUMBER,
    upgradeslots: NUMBER,
    level: NUMBER,
    str: NUMBER,
    dex: NUMBER,
    int: NUMBER,
    luk: NUMBER,
    hp: NUMBER,
    mp: NUMBER,
    watk: NUMBER,
    matk: NUMBER,
    wdef: NUMBER,
    mdef: NUMBER,
    acc: NUMBER,
    avoid: NUMBER,
    hands: NUMBER,
    speed: NUMBER,
    jump: NUMBER,
    owner: STRING,
    type: NUMBER
};
exports.hiredmerchanttempConversion = {
    id: NUMBER,
    ownerid: NUMBER,
    itemid: NUMBER,
    quantity: NUMBER,
    upgradeslots: NUMBER,
    level: NUMBER,
    str: NUMBER,
    dex: NUMBER,
    int: NUMBER,
    luk: NUMBER,
    hp: NUMBER,
    mp: NUMBER,
    watk: NUMBER,
    matk: NUMBER,
    wdef: NUMBER,
    mdef: NUMBER,
    acc: NUMBER,
    avoid: NUMBER,
    hands: NUMBER,
    speed: NUMBER,
    jump: NUMBER,
    owner: STRING,
    type: NUMBER,
    price: NUMBER
};
exports.htsquadsConversion = {
    id: NUMBER,
    channel: NUMBER,
    leaderid: NUMBER,
    status: NUMBER,
    members: NUMBER
};
exports.inventoryequipmentConversion = {
    inventoryequipmentid: NUMBER,
    inventoryitemid: NUMBER,
    upgradeslots: NUMBER,
    level: NUMBER,
    str: NUMBER,
    dex: NUMBER,
    int: NUMBER,
    luk: NUMBER,
    hp: NUMBER,
    mp: NUMBER,
    watk: NUMBER,
    matk: NUMBER,
    wdef: NUMBER,
    mdef: NUMBER,
    acc: NUMBER,
    avoid: NUMBER,
    hands: NUMBER,
    speed: NUMBER,
    jump: NUMBER,
    ringid: NUMBER,
    locked: NUMBER
};
exports.inventoryitemsConversion = {
    inventoryitemid: NUMBER,
    characterid: NUMBER,
    storageid: NUMBER,
    itemid: NUMBER,
    inventorytype: NUMBER,
    position: NUMBER,
    quantity: NUMBER,
    owner: STRING,
    petid: NUMBER,
    expiration: NUMBER
};
exports.ipbansConversion = {
    ipbanid: NUMBER,
    ip: STRING
};
exports.iplogConversion = {
    iplogid: NUMBER,
    accountid: NUMBER,
    ip: STRING,
    login: DATE
};
exports.jobchangesConversion = {
    id: NUMBER,
    cid: NUMBER,
    jobid: NUMBER
};
exports.jobsConversion = {
    id: NUMBER,
    characterid: NUMBER,
    jobid: NUMBER
};
exports.keymapConversion = {
    id: NUMBER,
    characterid: NUMBER,
    key: NUMBER,
    type: NUMBER,
    action: NUMBER
};
exports.library_v62Conversion = {
    db_id: NUMBER,
    id: NUMBER,
    name: STRING,
    type: STRING
};
exports.loginserverConversion = {
    loginserverid: NUMBER,
    key: STRING,
    world: NUMBER
};
exports.macbansConversion = {
    macbanid: NUMBER,
    mac: STRING
};
exports.macfiltersConversion = {
    macfilterid: NUMBER,
    filter: STRING
};
exports.marriagesConversion = {
    marriageid: NUMBER,
    husbandid: NUMBER,
    wifeid: NUMBER
};
exports.mn_designConversion = {
    ID: NUMBER,
    heroImage: STRING,
    logo: STRING
};
exports.mn_downloadsConversion = {
    ID: NUMBER,
    name: STRING,
    url: STRING
};
exports.mn_layoutConversion = {
    ID: NUMBER,
    name: STRING,
    json: STRING
};
exports.mn_palettesConversion = {
    name: STRING,
    mainColor: STRING,
    secondaryMainColor: STRING,
    fontColorLight: STRING,
    fontColorDark: STRING,
    fillColor: STRING,
    active: NUMBER
};
exports.mn_schemeConversion = {
    ID: NUMBER,
    mainColor: NUMBER,
    secondaryColor: NUMBER,
    fontColorLight: NUMBER,
    fontColorDark: NUMBER,
    highlightColor: NUMBER
};
exports.mn_settingsConversion = {
    ID: NUMBER,
    serverName: STRING,
    version: STRING,
    expRate: STRING,
    dropRate: STRING,
    mesoRate: STRING,
    nxColumn: STRING,
    vpColumn: STRING,
    gmLevel: NUMBER
};
exports.mn_voteConversion = {
    ID: NUMBER,
    name: STRING,
    nx: NUMBER,
    time: STRING,
    url: STRING
};
exports.mn_votingConversion = {
    ID: NUMBER,
    accountid: NUMBER,
    voteid: NUMBER,
    date: DATE
};
exports.monsterdropsConversion = {
    monsterdropid: NUMBER,
    monsterid: NUMBER,
    itemid: NUMBER,
    chance: NUMBER
};
exports.monsterquestdropsConversion = {
    id: NUMBER,
    itemid: NUMBER,
    monsterid: NUMBER,
    chance: NUMBER,
    questid: NUMBER
};
exports.mts_cartConversion = {
    id: NUMBER,
    cid: NUMBER,
    itemid: NUMBER
};
exports.mts_itemsConversion = {
    id: NUMBER,
    tab: NUMBER,
    type: NUMBER,
    itemid: NUMBER,
    quantity: NUMBER,
    seller: NUMBER,
    price: NUMBER,
    bid_incre: NUMBER,
    buy_now: NUMBER,
    position: NUMBER,
    upgradeslots: NUMBER,
    level: NUMBER,
    str: NUMBER,
    dex: NUMBER,
    int: NUMBER,
    luk: NUMBER,
    hp: NUMBER,
    mp: NUMBER,
    watk: NUMBER,
    matk: NUMBER,
    wdef: NUMBER,
    mdef: NUMBER,
    acc: NUMBER,
    avoid: NUMBER,
    hands: NUMBER,
    speed: NUMBER,
    jump: NUMBER,
    locked: NUMBER,
    isequip: NUMBER,
    owner: STRING,
    sellername: STRING,
    sell_ends: STRING,
    transfer: NUMBER
};
exports.notesConversion = {
    id: NUMBER,
    to: STRING,
    from: STRING,
    message: STRING,
    timestamp: NUMBER
};
exports.nxcodeConversion = {
    code: STRING,
    valid: NUMBER,
    user: STRING,
    type: NUMBER,
    item: NUMBER
};
exports.nxcode_trackConversion = {
    ID: NUMBER,
    IP: STRING,
    Day: NUMBER
};
exports.petsConversion = {
    petid: NUMBER,
    name: STRING,
    level: NUMBER,
    closeness: NUMBER,
    fullness: NUMBER
};
exports.player_variablesConversion = {
    id: NUMBER,
    characterid: NUMBER,
    name: STRING,
    value: STRING
};
exports.playernpcsConversion = {
    id: NUMBER,
    name: STRING,
    hair: NUMBER,
    face: NUMBER,
    skin: NUMBER,
    dir: NUMBER,
    x: NUMBER,
    y: NUMBER,
    cy: NUMBER,
    map: NUMBER,
    gender: NUMBER,
    ScriptId: NUMBER,
    Foothold: NUMBER,
    rx0: NUMBER,
    rx1: NUMBER
};
exports.playernpcs_equipConversion = {
    id: NUMBER,
    npcid: NUMBER,
    equipid: NUMBER,
    equippos: NUMBER
};
exports.questactionsConversion = {
    questactionid: NUMBER,
    questid: NUMBER,
    status: NUMBER,
    data: STRING
};
exports.questrequirementsConversion = {
    questrequirementid: NUMBER,
    questid: NUMBER,
    status: NUMBER,
    data: STRING
};
exports.queststatusConversion = {
    queststatusid: NUMBER,
    characterid: NUMBER,
    quest: NUMBER,
    status: NUMBER,
    time: NUMBER,
    forfeited: NUMBER
};
exports.queststatusmobsConversion = {
    queststatusmobid: NUMBER,
    queststatusid: NUMBER,
    mob: NUMBER,
    count: NUMBER
};
exports.reactordropsConversion = {
    reactordropid: NUMBER,
    reactorid: NUMBER,
    itemid: NUMBER,
    chance: NUMBER,
    questid: NUMBER
};
exports.reportsConversion = {
    id: NUMBER,
    reporttime: DATE,
    reporterid: NUMBER,
    victimid: NUMBER,
    reason: NUMBER,
    chatlog: STRING,
    status: STRING
};
exports.ringsConversion = {
    id: NUMBER,
    partnerRingId: NUMBER,
    partnerChrId: NUMBER,
    itemid: NUMBER,
    partnername: STRING
};
exports.savedlocationsConversion = {
    id: NUMBER,
    characterid: NUMBER,
    locationtype: STRING,
    map: NUMBER
};
exports.shell_commentsConversion = {
    id: NUMBER,
    name: STRING,
    content: STRING,
    date: NUMBER,
    auther: STRING,
    likes: STRING,
    users: STRING
};
exports.shell_contentConversion = {
    id: NUMBER,
    ServerName: STRING,
    Slogan: STRING,
    ServerLogo: STRING,
    SitePath: STRING,
    ForumURL: STRING,
    DownloadClientUrl: STRING,
    DownloadSetupUrl: STRING,
    NXcolumn: STRING,
    VPcolumn: STRING,
    Version: STRING,
    EXPRate: STRING,
    MesoRate: STRING,
    DropRate: STRING
};
exports.shell_newsConversion = {
    id: NUMBER,
    titel: STRING,
    content: STRING,
    date: STRING,
    type: STRING,
    likes: NUMBER,
    users: STRING
};
exports.shell_stylehomeConversion = {
    id: NUMBER,
    home: STRING,
    news: STRING,
    homerank: STRING,
    button1: STRING,
    button2: STRING,
    button3: STRING,
    button4: STRING,
    fontColor: STRING,
    rank: STRING,
    acc: STRING,
    download: STRING
};
exports.shell_ticketsConversion = {
    id: NUMBER,
    ip: STRING,
    category: STRING,
    Supp_type: STRING,
    title: STRING,
    content: STRING,
    date: STRING,
    name: STRING
};
exports.shell_voteConversion = {
    id: NUMBER,
    voteLink: STRING,
    nameOfSite: STRING,
    ANX: STRING,
    AVP: STRING,
    cooldown: STRING
};
exports.shell_voteplayerConversion = {
    id: NUMBER,
    ip: STRING,
    siteid: STRING,
    account: STRING,
    date: NUMBER,
    times: NUMBER
};
exports.shopitemsConversion = {
    shopitemid: NUMBER,
    shopid: NUMBER,
    itemid: NUMBER,
    price: NUMBER,
    position: NUMBER,
    refresh: NUMBER,
    availible: NUMBER
};
exports.shopsConversion = {
    shopid: NUMBER,
    npcid: NUMBER
};
exports.skillmacrosConversion = {
    id: NUMBER,
    characterid: NUMBER,
    position: NUMBER,
    skill1: NUMBER,
    skill2: NUMBER,
    skill3: NUMBER,
    name: STRING,
    shout: NUMBER
};
exports.skillsConversion = {
    id: NUMBER,
    skillid: NUMBER,
    characterid: NUMBER,
    skilllevel: NUMBER,
    masterlevel: NUMBER
};
exports.spawnsConversion = {
    id: NUMBER,
    idd: NUMBER,
    f: NUMBER,
    fh: NUMBER,
    type: STRING,
    cy: NUMBER,
    rx0: NUMBER,
    rx1: NUMBER,
    x: NUMBER,
    y: NUMBER,
    mobtime: NUMBER,
    mid: NUMBER
};
exports.storagesConversion = {
    storageid: NUMBER,
    accountid: NUMBER,
    slots: NUMBER,
    meso: NUMBER
};
exports.tradesConversion = {
    id: NUMBER,
    itemid: NUMBER,
    quantity: NUMBER,
    sellingPrice: NUMBER,
    mAtt: NUMBER,
    wAtt: NUMBER,
    Luk: NUMBER,
    intS: NUMBER,
    Str: NUMBER,
    Dex: NUMBER,
    Speed: NUMBER,
    Jump: NUMBER,
    WDef: NUMBER,
    MDef: NUMBER,
    Upgades: NUMBER,
    isNotEquippable: NUMBER
};
exports.trocklocationsConversion = {
    trockid: NUMBER,
    characterid: NUMBER,
    mapid: NUMBER
};
exports.viprockmapsConversion = {
    id: NUMBER,
    cid: NUMBER,
    mapid: NUMBER,
    type: NUMBER
};
exports.website_eventsConversion = {
    id: NUMBER,
    title: STRING,
    author: STRING,
    date: STRING,
    type: STRING,
    status: STRING,
    content: STRING,
    views: NUMBER
};
exports.website_newsConversion = {
    id: NUMBER,
    title: STRING,
    author: STRING,
    date: STRING,
    type: STRING,
    content: STRING,
    views: NUMBER
};
exports.wishlistConversion = {
    id: NUMBER,
    characterid: NUMBER,
    sn: NUMBER
};
exports.zaksquadsConversion = {
    id: NUMBER,
    channel: NUMBER,
    leaderid: NUMBER,
    status: NUMBER,
    members: NUMBER
};
//# sourceMappingURL=MysqlConversions.js.map