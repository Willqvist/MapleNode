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
  '-1': 'Overall',
  '100': 'Mage',
  '0': 'Beginner',
  '200': 'Warrior',
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
