const constants = {
  prefix: '',
};

export function getConstant<T>(constant: string): T {
  return <T>constants[constant];
}

export function setConstant(constant: string, value: any) {
  constants[constant] = value;
}

// instansiating constants
setConstant('jobs', {
  '0': 'Beginner',
  '100': 'Warrior',
  '110': 'Fighter',
  '111': 'Crusader',
  '112': 'Hero',
  '120': 'Page',
  '121': 'Whiteknight',
  '122': 'Paladin',
  '130': 'Spearman',
  '131': 'Dragonknight',
  '132': 'Darkknight',
  '200': 'Magician',
  '210': 'Fp_wizard',
  '211': 'Fp_mage',
  '212': 'Fp_archmage',
  '220': 'Il_wizard',
  '221': 'Il_mage',
  '222': 'Il_archmage',
  '230': 'Cleric',
  '231': 'Priest',
  '232': 'Bishop',
  '300': 'Bowman',
  '310': 'Hunter',
  '311': 'Ranger',
  '312': 'Bowmaster',
  '320': 'Crossbowman',
  '321': 'Sniper',
  '322': 'Crossbowmaster',
  '400': 'Thief',
  '410': 'Assassin',
  '411': 'Hermit',
  '412': 'Nightlord',
  '420': 'Bandit',
  '421': 'Chiefbandit',
  '422': 'Shadower',
  '500': 'Pirate',
  '510': 'Brawler',
  '520': 'Gunslinger',
  '511': 'Marauder',
  '521': 'Outlaw',
  '512': 'Buccaneer',
  '522': 'Corsair',
  '800': 'Mapleleaf_brigadier',
  '900': 'Gm',
  '910': 'Supergm',
  '1000': 'Noblesse',
  '1100': 'Dawnwarrior1',
  '1110': 'Dawnwarrior2',
  '1111': 'Dawnwarrior3',
  '1112': 'Dawnwarrior4',
  '1200': 'Blazewizard1',
  '1210': 'Blazewizard2',
  '1211': 'Blazewizard3',
  '1212': 'Blazewizard4',
  '1300': 'Windarcher1',
  '1310': 'Windarcher2',
  '1311': 'Windarcher3',
  '1312': 'Windarcher4',
  '1400': 'Nightwalker1',
  '1410': 'Nightwalker2',
  '1411': 'Nightwalker3',
  '1412': 'Nightwalker4',
  '1500': 'Thunderbreaker1',
  '1510': 'Thunderbreaker2',
  '1511': 'Thunderbreaker3',
  '1512': 'Thunderbreaker4',
  '2000': 'Legend',
  '2100': 'Aran2',
  '2110': 'Aran3',
  '2111': 'Aran4',
  '2112': 'Aran5'
});
setConstant('jobMethod', (jobs: { [key: string]: string }, name) => {
  return Object.keys(jobs).filter((key) => jobs[key] === name);
});
setConstant('type_mapper', {
  Consume: 'Item',
  Etc: 'Item',
  Cash: 'Item',
  Pet: 'Item',
  Install: 'Item',
  Equip: 'Eqp',
  Eqp: 'Eqp',
  Mob: 'Mob',
});
setConstant('icon_mapper', {
  Item: 'icon',
  Eqp: 'icon',
  Mob: 'stand_0',
});
setConstant('MCG', 'Xml');
