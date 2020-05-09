/**
 * File contains interfaces for each table in the database.
 * @packageDocumentation
 */

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface AccountsInterface {
  id?: number;
  name?: string;
  password?: string;
  salt?: string;
  loggedin?: number;
  lastlogin?: Date;
  createdat?: Date;
  birthday?: Date;
  banned?: number;
  banreason?: string;
  gm?: number;
  email?: string;
  emailcode?: string;
  forumaccid?: number;
  macs?: string;
  lastpwemail?: Date;
  tempban?: Date;
  greason?: number;
  paypalNX?: number;
  mPoints?: number;
  cardNX?: number;
  donatorPoints?: number;
  guest?: number;
  LastLoginInMilliseconds?: number;
  LeaderPoints?: number;
  pqPoints?: number;
  lastknownip?: string;
  pin?: string;
  NomePessoal?: string;
  fb?: string;
  twt?: string;
  BetaPoints?: number;
  sitelogged?: string;
  webadmin?: number;
  nick?: string;
  mute?: number;
  ip?: string;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface AllianceInterface {
  id?: number;
  name?: string;
  notice?: string;
  capacity?: number;
  rank_title1?: string;
  rank_title2?: string;
  rank_title3?: string;
  rank_title4?: string;
  rank_title5?: string;
  guild1?: number;
  guild2?: number;
  guild3?: number;
  guild4?: number;
  guild5?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface BosslogInterface {
  bosslogid?: number;
  characterid?: number;
  bossid?: string;
  lastattempt?: Date;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface BuddiesInterface {
  id?: number;
  characterid?: number;
  buddyid?: number;
  pending?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface CashshopInterface {
  sn?: number;
  arg1?: number;
  arg2?: number;
  arg3?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface ChannelconfigInterface {
  channelconfigid?: number;
  channelid?: number;
  name?: string;
  value?: string;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface ChannelsInterface {
  channelid?: number;
  world?: number;
  number?: number;
  key?: string;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface CharactersInterface {
  id?: number;
  accountid?: number;
  world?: number;
  name?: string;
  level?: number;
  exp?: number;
  str?: number;
  dex?: number;
  luk?: number;
  int?: number;
  hp?: number;
  mp?: number;
  maxhp?: number;
  maxmp?: number;
  meso?: number;
  hpApUsed?: number;
  mpApUsed?: number;
  job?: number;
  skincolor?: number;
  gender?: number;
  fame?: number;
  hair?: number;
  face?: number;
  ap?: number;
  sp?: number;
  map?: number;
  spawnpoint?: number;
  gm?: number;
  party?: number;
  buddyCapacity?: number;
  createdate?: Date;
  rank?: number;
  rankMove?: number;
  jobRank?: number;
  jobRankMove?: number;
  guildid?: number;
  guildrank?: number;
  allianceRank?: number;
  messengerid?: number;
  messengerposition?: number;
  reborns?: number;
  pvpkills?: number;
  pvpdeaths?: number;
  clan?: number;
  mountlevel?: number;
  mountexp?: number;
  mounttiredness?: number;
  married?: number;
  partnerid?: number;
  cantalk?: number;
  zakumlvl?: number;
  marriagequest?: number;
  omok?: number;
  matchcard?: number;
  omokwins?: number;
  omoklosses?: number;
  omokties?: number;
  matchcardwins?: number;
  matchcardlosses?: number;
  matchcardties?: number;
  MerchantMesos?: number;
  HasMerchant?: number;
  gmtext?: number;
  equipslots?: number;
  useslots?: number;
  setupslots?: number;
  etcslots?: number;
  bosspoints?: number;
  bossrepeats?: number;
  nextBQ?: number;
  LeaderPoints?: number;
  pqPoints?: number;
  votePoints?: number;
  occupation?: number;
  jqpoints?: number;
  CashPoints?: number;
  jqrank?: number;
  webhide?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface CharactersonlineInterface {
  id?: number;
  characterName?: string;
  date?: Date;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface CheatlogInterface {
  id?: number;
  characterid?: number;
  offense?: string;
  count?: number;
  lastoffensetime?: Date;
  param?: string;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface CooldownsInterface {
  id?: number;
  charid?: number;
  SkillID?: number;
  length?: number;
  StartTime?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface DueyitemsInterface {
  id?: number;
  PackageId?: number;
  itemid?: number;
  quantity?: number;
  upgradeslots?: number;
  level?: number;
  str?: number;
  dex?: number;
  int?: number;
  luk?: number;
  hp?: number;
  mp?: number;
  watk?: number;
  matk?: number;
  wdef?: number;
  mdef?: number;
  acc?: number;
  avoid?: number;
  hands?: number;
  speed?: number;
  jump?: number;
  owner?: string;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface DueypackagesInterface {
  PackageId?: number;
  RecieverId?: number;
  SenderName?: string;
  Mesos?: number;
  TimeStamp?: string;
  Checked?: number;
  Type?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface EngagementsInterface {
  engagementid?: number;
  husbandid?: number;
  wifeid?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface EventstatsInterface {
  eventstatid?: number;
  event?: string;
  instance?: string;
  characterid?: number;
  channel?: number;
  time?: Date;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface FamelogInterface {
  famelogid?: number;
  characterid?: number;
  characterid_to?: number;
  when?: Date;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface GmlogInterface {
  id?: number;
  cid?: number;
  command?: string;
  when?: Date;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface GuildsInterface {
  guildid?: number;
  allianceId?: number;
  leader?: number;
  GP?: number;
  logo?: number;
  logoColor?: number;
  name?: string;
  rank1title?: string;
  rank2title?: string;
  rank3title?: string;
  rank4title?: string;
  rank5title?: string;
  capacity?: number;
  logoBG?: number;
  logoBGColor?: number;
  notice?: string;
  signature?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface HiredmerchantInterface {
  id?: number;
  ownerid?: number;
  itemid?: number;
  quantity?: number;
  upgradeslots?: number;
  level?: number;
  str?: number;
  dex?: number;
  int?: number;
  luk?: number;
  hp?: number;
  mp?: number;
  watk?: number;
  matk?: number;
  wdef?: number;
  mdef?: number;
  acc?: number;
  avoid?: number;
  hands?: number;
  speed?: number;
  jump?: number;
  owner?: string;
  type?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface HiredmerchanttempInterface {
  id?: number;
  ownerid?: number;
  itemid?: number;
  quantity?: number;
  upgradeslots?: number;
  level?: number;
  str?: number;
  dex?: number;
  int?: number;
  luk?: number;
  hp?: number;
  mp?: number;
  watk?: number;
  matk?: number;
  wdef?: number;
  mdef?: number;
  acc?: number;
  avoid?: number;
  hands?: number;
  speed?: number;
  jump?: number;
  owner?: string;
  type?: number;
  price?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface HtsquadsInterface {
  id?: number;
  channel?: number;
  leaderid?: number;
  status?: number;
  members?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface InventoryequipmentInterface {
  inventoryequipmentid?: number;
  inventoryitemid?: number;
  upgradeslots?: number;
  level?: number;
  str?: number;
  dex?: number;
  int?: number;
  luk?: number;
  hp?: number;
  mp?: number;
  watk?: number;
  matk?: number;
  wdef?: number;
  mdef?: number;
  acc?: number;
  avoid?: number;
  hands?: number;
  speed?: number;
  jump?: number;
  ringid?: number;
  locked?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface InventoryitemsInterface {
  inventoryitemid?: number;
  characterid?: number;
  storageid?: number;
  itemid?: number;
  inventorytype?: number;
  position?: number;
  quantity?: number;
  owner?: string;
  petid?: number;
  expiration?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface IpbansInterface {
  ipbanid?: number;
  ip?: string;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface IplogInterface {
  iplogid?: number;
  accountid?: number;
  ip?: string;
  login?: Date;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface JobchangesInterface {
  id?: number;
  cid?: number;
  jobid?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface JobsInterface {
  id?: number;
  characterid?: number;
  jobid?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface KeymapInterface {
  id?: number;
  characterid?: number;
  key?: number;
  type?: number;
  action?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface Library_v62Interface {
  db_id?: number;
  id?: number;
  name?: string;
  type?: string;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface LoginserverInterface {
  loginserverid?: number;
  key?: string;
  world?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface MacbansInterface {
  macbanid?: number;
  mac?: string;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface MacfiltersInterface {
  macfilterid?: number;
  filter?: string;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface MarriagesInterface {
  marriageid?: number;
  husbandid?: number;
  wifeid?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface DesignInterface {
  ID?: number;
  heroImage?: string;
  logo?: string;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface DownloadsInterface {
  ID?: number;
  name?: string;
  url?: string;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface LayoutInterface {
  ID?: number;
  name?: string;
  json?: string;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface PalettesInterface {
  name?: string;
  mainColor?: string;
  secondaryMainColor?: string;
  fontColorLight?: string;
  fontColorDark?: string;
  fillColor?: string;
  active?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface SchemeInterface {
  ID?: number;
  mainColor?: number;
  secondaryColor?: number;
  fontColorLight?: number;
  fontColorDark?: number;
  highlightColor?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface SettingsInterface {
  ID?: number;
  serverName?: string;
  version?: string;
  expRate?: string;
  dropRate?: string;
  mesoRate?: string;
  nxColumn?: string;
  vpColumn?: string;
  gmLevel?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface VoteInterface {
  ID?: number;
  name?: string;
  nx?: number;
  time?: string;
  url?: string;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface VotingInterface {
  ID?: number;
  accountid?: number;
  voteid?: number;
  date?: Date;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface MonsterdropsInterface {
  monsterdropid?: number;
  monsterid?: number;
  itemid?: number;
  chance?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface MonsterquestdropsInterface {
  id?: number;
  itemid?: number;
  monsterid?: number;
  chance?: number;
  questid?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface Mts_cartInterface {
  id?: number;
  cid?: number;
  itemid?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface Mts_itemsInterface {
  id?: number;
  tab?: number;
  type?: number;
  itemid?: number;
  quantity?: number;
  seller?: number;
  price?: number;
  bid_incre?: number;
  buy_now?: number;
  position?: number;
  upgradeslots?: number;
  level?: number;
  str?: number;
  dex?: number;
  int?: number;
  luk?: number;
  hp?: number;
  mp?: number;
  watk?: number;
  matk?: number;
  wdef?: number;
  mdef?: number;
  acc?: number;
  avoid?: number;
  hands?: number;
  speed?: number;
  jump?: number;
  locked?: number;
  isequip?: number;
  owner?: string;
  sellername?: string;
  sell_ends?: string;
  transfer?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface NotesInterface {
  id?: number;
  to?: string;
  from?: string;
  message?: string;
  timestamp?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface NxcodeInterface {
  code?: string;
  valid?: number;
  user?: string;
  type?: number;
  item?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface Nxcode_trackInterface {
  ID?: number;
  IP?: string;
  Day?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface PetsInterface {
  petid?: number;
  name?: string;
  level?: number;
  closeness?: number;
  fullness?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface Player_variablesInterface {
  id?: number;
  characterid?: number;
  name?: string;
  value?: string;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface PlayernpcsInterface {
  id?: number;
  name?: string;
  hair?: number;
  face?: number;
  skin?: number;
  dir?: number;
  x?: number;
  y?: number;
  cy?: number;
  map?: number;
  gender?: number;
  ScriptId?: number;
  Foothold?: number;
  rx0?: number;
  rx1?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface Playernpcs_equipInterface {
  id?: number;
  npcid?: number;
  equipid?: number;
  equippos?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface QuestactionsInterface {
  questactionid?: number;
  questid?: number;
  status?: number;
  data?: string;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface QuestrequirementsInterface {
  questrequirementid?: number;
  questid?: number;
  status?: number;
  data?: string;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface QueststatusInterface {
  queststatusid?: number;
  characterid?: number;
  quest?: number;
  status?: number;
  time?: number;
  forfeited?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface QueststatusmobsInterface {
  queststatusmobid?: number;
  queststatusid?: number;
  mob?: number;
  count?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface ReactordropsInterface {
  reactordropid?: number;
  reactorid?: number;
  itemid?: number;
  chance?: number;
  questid?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface ReportsInterface {
  id?: number;
  reporttime?: Date;
  reporterid?: number;
  victimid?: number;
  reason?: number;
  chatlog?: string;
  status?: string;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface RingsInterface {
  id?: number;
  partnerRingId?: number;
  partnerChrId?: number;
  itemid?: number;
  partnername?: string;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface SavedlocationsInterface {
  id?: number;
  characterid?: number;
  locationtype?: string;
  map?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface ShopitemsInterface {
  shopitemid?: number;
  shopid?: number;
  itemid?: number;
  price?: number;
  position?: number;
  refresh?: number;
  availible?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface ShopsInterface {
  shopid?: number;
  npcid?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface SkillmacrosInterface {
  id?: number;
  characterid?: number;
  position?: number;
  skill1?: number;
  skill2?: number;
  skill3?: number;
  name?: string;
  shout?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface SkillsInterface {
  id?: number;
  skillid?: number;
  characterid?: number;
  skilllevel?: number;
  masterlevel?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface SpawnsInterface {
  id?: number;
  idd?: number;
  f?: number;
  fh?: number;
  type?: string;
  cy?: number;
  rx0?: number;
  rx1?: number;
  x?: number;
  y?: number;
  mobtime?: number;
  mid?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface StoragesInterface {
  storageid?: number;
  accountid?: number;
  slots?: number;
  meso?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface TradesInterface {
  id?: number;
  itemid?: number;
  quantity?: number;
  sellingPrice?: number;
  mAtt?: number;
  wAtt?: number;
  Luk?: number;
  intS?: number;
  Str?: number;
  Dex?: number;
  Speed?: number;
  Jump?: number;
  WDef?: number;
  MDef?: number;
  Upgades?: number;
  isNotEquippable?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface TrocklocationsInterface {
  trockid?: number;
  characterid?: number;
  mapid?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface ViprockmapsInterface {
  id?: number;
  cid?: number;
  mapid?: number;
  type?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface Website_eventsInterface {
  id?: number;
  title?: string;
  author?: string;
  date?: string;
  type?: string;
  status?: string;
  content?: string;
  views?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface Website_newsInterface {
  id?: number;
  title?: string;
  author?: string;
  date?: string;
  type?: string;
  content?: string;
  views?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface WishlistInterface {
  id?: number;
  characterid?: number;
  sn?: number;
}

/**
 * Interface mapped to the database table with the same name,
 * is used in {@link Database}
 */
export interface ZaksquadsInterface {
  id?: number;
  channel?: number;
  leaderid?: number;
  status?: number;
  members?: number;
}
