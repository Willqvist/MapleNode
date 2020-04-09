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
export interface BosslogInterface {
   bosslogid?: number;
   characterid?: number;
   bossid?: string;
   lastattempt?: Date;
}
export interface BuddiesInterface {
   id?: number;
   characterid?: number;
   buddyid?: number;
   pending?: number;
}
export interface CashshopInterface {
   sn?: number;
   arg1?: number;
   arg2?: number;
   arg3?: number;
}
export interface ChannelconfigInterface {
   channelconfigid?: number;
   channelid?: number;
   name?: string;
   value?: string;
}
export interface ChannelsInterface {
   channelid?: number;
   world?: number;
   number?: number;
   key?: string;
}
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
export interface CharactersonlineInterface {
   id?: number;
   characterName?: string;
   date?: Date;
}
export interface CheatlogInterface {
   id?: number;
   characterid?: number;
   offense?: string;
   count?: number;
   lastoffensetime?: Date;
   param?: string;
}
export interface CooldownsInterface {
   id?: number;
   charid?: number;
   SkillID?: number;
   length?: number;
   StartTime?: number;
}
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
export interface DueypackagesInterface {
   PackageId?: number;
   RecieverId?: number;
   SenderName?: string;
   Mesos?: number;
   TimeStamp?: string;
   Checked?: number;
   Type?: number;
}
export interface EngagementsInterface {
   engagementid?: number;
   husbandid?: number;
   wifeid?: number;
}
export interface EventstatsInterface {
   eventstatid?: number;
   event?: string;
   instance?: string;
   characterid?: number;
   channel?: number;
   time?: Date;
}
export interface FamelogInterface {
   famelogid?: number;
   characterid?: number;
   characterid_to?: number;
   when?: Date;
}
export interface GmlogInterface {
   id?: number;
   cid?: number;
   command?: string;
   when?: Date;
}
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
export interface HtsquadsInterface {
   id?: number;
   channel?: number;
   leaderid?: number;
   status?: number;
   members?: number;
}
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
export interface IpbansInterface {
   ipbanid?: number;
   ip?: string;
}
export interface IplogInterface {
   iplogid?: number;
   accountid?: number;
   ip?: string;
   login?: Date;
}
export interface JobchangesInterface {
   id?: number;
   cid?: number;
   jobid?: number;
}
export interface JobsInterface {
   id?: number;
   characterid?: number;
   jobid?: number;
}
export interface KeymapInterface {
   id?: number;
   characterid?: number;
   key?: number;
   type?: number;
   action?: number;
}
export interface Library_v62Interface {
   db_id?: number;
   id?: number;
   name?: string;
   type?: string;
}
export interface LoginserverInterface {
   loginserverid?: number;
   key?: string;
   world?: number;
}
export interface MacbansInterface {
   macbanid?: number;
   mac?: string;
}
export interface MacfiltersInterface {
   macfilterid?: number;
   filter?: string;
}
export interface MarriagesInterface {
   marriageid?: number;
   husbandid?: number;
   wifeid?: number;
}
export interface DesignInterface {
   ID?: number;
   heroImage?: string;
   logo?: string;
}
export interface DownloadsInterface {
   ID?: number;
   name?: string;
   url?: string;
}
export interface LayoutInterface {
   ID?: number;
   name?: string;
   json?: string;
}
export interface PalettesInterface {
   name?: string;
   mainColor?: string;
   secondaryMainColor?: string;
   fontColorLight?: string;
   fontColorDark?: string;
   fillColor?: string;
   active?: number;
}
export interface SchemeInterface {
   ID?: number;
   mainColor?: number;
   secondaryColor?: number;
   fontColorLight?: number;
   fontColorDark?: number;
   highlightColor?: number;
}
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
export interface VoteInterface {
   ID?: number;
   name?: string;
   nx?: number;
   time?: string;
   url?: string;
}
export interface VotingInterface {
   ID?: number;
   accountid?: number;
   voteid?: number;
   date?: Date;
}
export interface MonsterdropsInterface {
   monsterdropid?: number;
   monsterid?: number;
   itemid?: number;
   chance?: number;
}
export interface MonsterquestdropsInterface {
   id?: number;
   itemid?: number;
   monsterid?: number;
   chance?: number;
   questid?: number;
}
export interface Mts_cartInterface {
   id?: number;
   cid?: number;
   itemid?: number;
}
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
export interface NotesInterface {
   id?: number;
   to?: string;
   from?: string;
   message?: string;
   timestamp?: number;
}
export interface NxcodeInterface {
   code?: string;
   valid?: number;
   user?: string;
   type?: number;
   item?: number;
}
export interface Nxcode_trackInterface {
   ID?: number;
   IP?: string;
   Day?: number;
}
export interface PetsInterface {
   petid?: number;
   name?: string;
   level?: number;
   closeness?: number;
   fullness?: number;
}
export interface Player_variablesInterface {
   id?: number;
   characterid?: number;
   name?: string;
   value?: string;
}
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
export interface Playernpcs_equipInterface {
   id?: number;
   npcid?: number;
   equipid?: number;
   equippos?: number;
}
export interface QuestactionsInterface {
   questactionid?: number;
   questid?: number;
   status?: number;
   data?: string;
}
export interface QuestrequirementsInterface {
   questrequirementid?: number;
   questid?: number;
   status?: number;
   data?: string;
}
export interface QueststatusInterface {
   queststatusid?: number;
   characterid?: number;
   quest?: number;
   status?: number;
   time?: number;
   forfeited?: number;
}
export interface QueststatusmobsInterface {
   queststatusmobid?: number;
   queststatusid?: number;
   mob?: number;
   count?: number;
}
export interface ReactordropsInterface {
   reactordropid?: number;
   reactorid?: number;
   itemid?: number;
   chance?: number;
   questid?: number;
}
export interface ReportsInterface {
   id?: number;
   reporttime?: Date;
   reporterid?: number;
   victimid?: number;
   reason?: number;
   chatlog?: string;
   status?: string;
}
export interface RingsInterface {
   id?: number;
   partnerRingId?: number;
   partnerChrId?: number;
   itemid?: number;
   partnername?: string;
}
export interface SavedlocationsInterface {
   id?: number;
   characterid?: number;
   locationtype?: string;
   map?: number;
}
export interface Shell_commentsInterface {
   id?: number;
   name?: string;
   content?: string;
   date?: number;
   auther?: string;
   likes?: string;
   users?: string;
}
export interface Shell_contentInterface {
   id?: number;
   ServerName?: string;
   Slogan?: string;
   ServerLogo?: string;
   SitePath?: string;
   ForumURL?: string;
   DownloadClientUrl?: string;
   DownloadSetupUrl?: string;
   NXcolumn?: string;
   VPcolumn?: string;
   Version?: string;
   EXPRate?: string;
   MesoRate?: string;
   DropRate?: string;
}
export interface Shell_newsInterface {
   id?: number;
   titel?: string;
   content?: string;
   date?: string;
   type?: string;
   likes?: number;
   users?: string;
}
export interface Shell_stylehomeInterface {
   id?: number;
   home?: string;
   news?: string;
   homerank?: string;
   button1?: string;
   button2?: string;
   button3?: string;
   button4?: string;
   fontColor?: string;
   rank?: string;
   acc?: string;
   download?: string;
}
export interface Shell_ticketsInterface {
   id?: number;
   ip?: string;
   category?: string;
   Supp_type?: string;
   title?: string;
   content?: string;
   date?: string;
   name?: string;
}
export interface Shell_voteInterface {
   id?: number;
   voteLink?: string;
   nameOfSite?: string;
   ANX?: string;
   AVP?: string;
   cooldown?: string;
}
export interface Shell_voteplayerInterface {
   id?: number;
   ip?: string;
   siteid?: string;
   account?: string;
   date?: number;
   times?: number;
}
export interface ShopitemsInterface {
   shopitemid?: number;
   shopid?: number;
   itemid?: number;
   price?: number;
   position?: number;
   refresh?: number;
   availible?: number;
}
export interface ShopsInterface {
   shopid?: number;
   npcid?: number;
}
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
export interface SkillsInterface {
   id?: number;
   skillid?: number;
   characterid?: number;
   skilllevel?: number;
   masterlevel?: number;
}
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
export interface StoragesInterface {
   storageid?: number;
   accountid?: number;
   slots?: number;
   meso?: number;
}
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
export interface TrocklocationsInterface {
   trockid?: number;
   characterid?: number;
   mapid?: number;
}
export interface ViprockmapsInterface {
   id?: number;
   cid?: number;
   mapid?: number;
   type?: number;
}
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
export interface Website_newsInterface {
   id?: number;
   title?: string;
   author?: string;
   date?: string;
   type?: string;
   content?: string;
   views?: number;
}
export interface WishlistInterface {
   id?: number;
   characterid?: number;
   sn?: number;
}
export interface ZaksquadsInterface {
   id?: number;
   channel?: number;
   leaderid?: number;
   status?: number;
   members?: number;
}
