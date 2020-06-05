import fs from 'fs';
import { DOMParser } from 'xmldom';
import Canvas from './Canvas';
import ImageBuilder from './ImageBuilder';
import { PartsInterface } from '../core/Interfaces/Interfaces';
import { Player, EqiupItem } from './MCG';

export default class ItemBuilder extends ImageBuilder {
  // 145200-1452155 OFFSET
  //
  private canvas: Canvas;

  private offsetX: number;

  private offsetY: number;

  private parts: PartsInterface;

  private clothOffset: { x: number; y: number };

  private headPosition: { x: number; y: number };

  private faceOffset: { x: number; y: number };

  private bowOffset: { x: number; y: number };

  private prefixes: { hairShade: string };

  private body: {
    stand2: {
      head: { position: { x: number; y: number } };
      body: { position: { x: number; y: number } };
      arm: { position: { x: number; y: number } };
      hand: { position: { x: number; y: number } };
    };
    stand1: {
      head: { part: string; position: { x: number; y: number } };
      body: { position: { x: number; y: number } };
      arm: { position: { x: number; y: number }; type: string };
    };
  };

  private parser: DOMParser;

  constructor() {
    super();
    this.canvas = new Canvas(96, 96);
    this.offsetX = 44;
    this.offsetY = 33;
    this.parts = {};
    this.clothOffset = { x: 0, y: 10 };
    this.headPosition = { x: -15, y: -11 };
    this.faceOffset = { x: 0, y: 1 };
    this.bowOffset = { x: -0, y: -0 };

    this.prefixes = {
      hairShade: '.0',
    };

    this.body = {
      stand1: {
        body: {
          position: { x: 7 + this.headPosition.x, y: 33 + this.headPosition.y },
        },
        head: {
          part: 'head',
          position: this.headPosition,
        },
        arm: {
          type: 'arm',
          position: { x: 23 + this.headPosition.x, y: 35 + this.headPosition.y },
        },
      },
      stand2: {
        body: {
          position: { x: 8 + this.headPosition.x, y: 33 + this.headPosition.y },
        },
        head: {
          position: this.headPosition,
        },
        arm: {
          position: { x: 19 + this.headPosition.x, y: 35 + this.headPosition.y },
        },
        hand: {
          position: { x: 5 + this.headPosition.x, y: 38 + this.headPosition.y },
        },
      },
    };
    this.parser = new DOMParser();
  }

  getParsed(type: string, id: number) {
    return this.parser.parseFromString(fs.readFileSync(`${this.getPath(type, id)}coord.xml`, 'utf8'), 'text/xml');
  }

  getPath(type, id) {
    return `${__dirname}/gd/${type}/${`${id}`.padStart(8, '0')}.img/`;
  }

  setHair(id: number, z: string, next: () => void) {
    if (typeof this.parts.cap !== 'undefined' && z === 'hairOverHead') return next();

    const file = this.getParsed('Hair', id);
    const hairs = file.getElementsByTagName(`_${z}`);
    if (hairs.length === 0) return next();

    const hair = hairs[0];
    let prefix = '';
    if (typeof this.prefixes[z] !== 'undefined') prefix = this.prefixes[z];
    const x = hair.getElementsByTagName('x')[0].firstChild.textContent;
    const y = hair.getElementsByTagName('y')[0].firstChild.textContent;
    this.loadImage(`${__dirname}/gd//Hair/000${id}.img/default.${z + prefix}.png`, (image) => {
      this.canvas.drawImage(image, this.offsetX + parseInt(x), this.offsetY + parseInt(y) + this.faceOffset.y);
      next();
    });
  }

  setFace(id: number, z: string, next: () => void) {
    const file = this.getParsed('Face', id);
    const x = file.getElementsByTagName('x')[0].firstChild.data;
    const y = file.getElementsByTagName('y')[0].firstChild.data;
    this.loadImage(`${__dirname}/gd//Face/000${id}.img/default.face.png`, (image) => {
      this.canvas.drawImage(
        image,
        this.offsetX + parseInt(x) + this.faceOffset.x,
        this.offsetY + parseInt(y) + this.faceOffset.y
      );
      next();
    });
  }

  /*
    setBody(ids, pos,callback){
        this.loadBodyInformation(ids.skin, pos,(parts)=>
        {
            for(let i = 0; i < parts.length; i++){
                let part = parts[i];
                this.canvas.drawImage(part.image,this.offsetX + part.position.x, this.offsetY + part.position.y);
            }
            this.getFace(ids.face,()=>{});
            this.loadImage(this.getPath("Face",ids.face)+"default.face.png",(image)=>
            {
                callback();
            });
        });
    }
    */
  setCap(id: number, z: string, next: () => void) {
    const file = this.getParsed('Cap', id);
    let zElem;
    let nodeName;
    const elements = file.getElementsByTagName('z');
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].firstChild.data === z) {
        nodeName = elements[i].parentNode.parentNode.nodeName.replace('_', '');
        zElem = elements[i].parentNode;
        break;
      }
    }
    if (!zElem) return next();
    const x = zElem.getElementsByTagName('x')[0].firstChild.data;
    const y = zElem.getElementsByTagName('y')[0].firstChild.data;
    this.loadImage(`${this.getPath('Cap', id)}default.${nodeName}.png`, (image) => {
      const { position } = this.body[`stand${this.parts.stand}`].body;
      this.canvas.drawImage(image, this.offsetX + parseInt(x), this.offsetY + parseInt(y) + this.faceOffset.y);
      next();
    });
  }

  setMask(id, z, next) {}

  setEars(id, z, next) {}

  setAccessory(id: number, z: string, next: () => void) {
    const file = this.getParsed('Accessory', id);
    let zElem;
    const elements = file.getElementsByTagName('z');
    let nodeName;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].firstChild.data === z) {
        nodeName = elements[i].parentNode.parentNode.nodeName.replace('_', '');
        zElem = elements[i].parentNode;
        break;
      }
    }
    if (!zElem) return next();

    const x = zElem.getElementsByTagName('x')[0].firstChild.data;
    const y = zElem.getElementsByTagName('y')[0].firstChild.data;
    this.loadImage(`${this.getPath('Accessory', id)}default.default.png`, (image) => {
      this.canvas.drawImage(
        image,
        this.faceOffset.x + this.offsetX + parseInt(x),
        this.faceOffset.y + this.offsetY + parseInt(y)
      );
      next();
    });
  }

  setUpperBodyCloth(id: number, z: string, next: () => void, type: string) {
    const file = this.getParsed(type, id);
    const elements = file.getElementsByTagName('z');
    let zElem;
    let nodeName;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].parentNode.nodeName === `stand${this.parts.stand}` && elements[i].firstChild.data === z) {
        nodeName = elements[i].parentNode.parentNode.nodeName.replace('_', '');
        zElem = elements[i].parentNode;
        break;
      }
    }
    if (!zElem) return next();
    const x = zElem.getElementsByTagName('x')[0].firstChild.data;
    const y = zElem.getElementsByTagName('y')[0].firstChild.data;
    this.loadImage(`${this.getPath(type, id)}stand${this.parts.stand}.0.${nodeName}.png`, (image) => {
      const { position } = this.body[`stand${this.parts.stand}`].body;
      this.canvas.drawImage(
        image,
        this.clothOffset.x + this.offsetX + parseInt(x),
        this.clothOffset.y + position.y + this.offsetY + parseInt(y)
      );
      next();
    });
  }

  setCoat(id: number, z: string, next: () => void) {
    if (!fs.existsSync(`${this.getPath('Coat', id)}coord.xml`)) return next();
    this.setUpperBodyCloth(id, z, next, 'Coat');
  }

  setLongCoat(id: number, z: string, next: () => void) {
    if (!fs.existsSync(`${this.getPath('LongCoat', id)}coord.xml`)) return next();
    this.setUpperBodyCloth(id, z, next, 'LongCoat');
  }

  setPants(id: number, z: string, next: () => void) {
    const file = this.getParsed('Pants', id);
    const elements = file.getElementsByTagName('z');
    let zElem;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].parentNode.nodeName.includes(`stand${this.parts.stand}`) && elements[i].firstChild.data === z) {
        zElem = elements[i].parentNode;
        break;
      }
    }
    if (!zElem) return next();
    const x = zElem.getElementsByTagName('x')[0].firstChild.data;
    const y = zElem.getElementsByTagName('y')[0].firstChild.data;
    const stand = 1;
    this.loadImage(`${this.getPath('Pants', id)}stand${stand}.0.pants.png`, (image) => {
      const { position } = this.body[`stand${this.parts.stand}`].body;
      this.canvas.drawImage(
        image,
        this.clothOffset.x + this.offsetX + parseInt(x),
        this.clothOffset.y + position.y + this.offsetY + parseInt(y)
      );
      next();
    });
  }

  setShoes(id: number, z: string, next: () => void) {
    const file = this.getParsed('Shoes', id);
    const elements = file.getElementsByTagName('z');
    let zElem;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].parentNode.nodeName.includes('stand1') && elements[i].firstChild.data === z) {
        zElem = elements[i].parentNode;
        break;
      }
    }
    if (!zElem) return next();
    const x = zElem.getElementsByTagName('x')[0].firstChild.data;
    const y = zElem.getElementsByTagName('y')[0].firstChild.data;
    this.loadImage(`${this.getPath('Shoes', id)}stand1.0.shoes.png`, (image) => {
      const { position } = this.body[`stand${this.parts.stand}`].body;
      this.canvas.drawImage(
        image,
        this.clothOffset.x + this.offsetX + parseInt(x),
        this.clothOffset.y + position.y + this.offsetY + parseInt(y)
      );
      next();
    });
  }

  setGloves(id: number, z: string, next: () => void) {
    const file = this.getParsed('Glove', id);
    const elements = file.getElementsByTagName('z');
    const zElem = [];
    const positions = [];
    let nodeName;
    for (let i = 0; i < elements.length; i++) {
      if (
        elements[i].parentNode.nodeName.replace('_', '') === `stand${this.parts.stand}` &&
        elements[i].firstChild.data === z
      ) {
        nodeName = elements[i].parentNode.parentNode.nodeName.replace('_', '');
        zElem.push(elements[i].parentNode);
        positions.push({
          x: elements[i].parentNode.getElementsByTagName('x')[0].firstChild.data,
          y: elements[i].parentNode.getElementsByTagName('y')[0].firstChild.data,
        });
      }
    }
    if (zElem.length === 0) return next();
    this.loadImage(`${this.getPath('Glove', id)}stand${this.parts.stand}.0.${nodeName}.png`, (image) => {
      const { position } = this.body[`stand${this.parts.stand}`].body;
      for (let i = 0; i < positions.length; i++) {
        this.canvas.drawImage(
          image,
          this.clothOffset.x + this.offsetX + parseInt(positions[i].x),
          this.clothOffset.y + position.y + this.offsetY + parseInt(positions[i].y)
        );
      }
      next();
    });
  }

  setCape(id: number, z: string, next: () => void) {
    const file = this.getParsed('Cape', id);
    const elements = file.getElementsByTagName('z');
    let zElem;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].parentNode.nodeName.includes('stand1') && elements[i].firstChild.data === z) {
        zElem = elements[i].parentNode;
        break;
      }
    }
    if (!zElem) {
      return next();
    }
    const x = zElem.getElementsByTagName('x')[0].firstChild.data;
    const y = zElem.getElementsByTagName('y')[0].firstChild.data;
    this.loadImage(`${this.getPath('Cape', id)}stand1.0.cape.png`, (image) => {
      const { position } = this.body[`stand${this.parts.stand}`].body;
      this.canvas.drawImage(
        image,
        this.clothOffset.x + this.offsetX + parseInt(x, 10),
        this.clothOffset.y + position.y + this.offsetY + parseInt(y, 10)
      );
      next();
    });
  }

  setShield(id: number, z: string, next: () => void) {
    if (this.parts.stand != 1) return next();
    const file = this.getParsed('Shield', id);
    const x = file.getElementsByTagName('x')[0].firstChild.data;
    const y = file.getElementsByTagName('y')[0].firstChild.data;
    this.loadImage(`${__dirname}/gd//Shield/0${id}.img/stand1.0.shield.png`, (image) => {
      const { position } = this.body[`stand${this.parts.stand}`].body;
      this.canvas.drawImage(
        image,
        this.clothOffset.x + this.offsetX + parseInt(x),
        this.clothOffset.y + position.y + this.offsetY + parseInt(y)
      );
      next();
    });
  }

  setWeapon(id: number, z: string, next: () => void) {
    const file = this.getParsed('Weapon', id);
    let prefix = '';
    let zElem;
    const elements = file.getElementsByTagName('z');
    let nodeName;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].parentNode.nodeName.includes(`stand${this.parts.stand}`) && elements[i].firstChild.data === z) {
        nodeName = elements[i].parentNode.parentNode.nodeName.replace('_', '');
        zElem = elements[i].parentNode;
        break;
      }
    }
    if (!zElem) return next();
    const infoStand = file.getElementsByTagName('_info')[0].getElementsByTagName(nodeName.replace('_', ''))[0];
    const x = zElem.getElementsByTagName('x')[0].firstChild.data;
    const y = zElem.getElementsByTagName('y')[0].firstChild.data;
    if (infoStand != null) {
      let child;
      if ((child = infoStand.getElementsByTagName('NUM')[0]) != null) {
        prefix = `${child.firstChild.data}.`;
      }
    }
    this.loadImage(`${this.getPath('Weapon', id) + prefix}stand${this.parts.stand}.0.${nodeName}.png`, (image) => {
      const { position } = this.body[`stand${this.parts.stand}`].body;
      this.canvas.drawImage(
        image,
        this.clothOffset.x + this.offsetX + this.bowOffset.x + parseInt(x),
        this.clothOffset.y + this.bowOffset.y + position.y + this.offsetY + parseInt(y)
      );
      next();
    });
  }

  getZElement(dom: DOMParser, z: number) {
    const zObj = dom.getElementsByTagName('z');
    for (let i = 0; i < zObj.length; i++) {
      if (zObj[i].firstChild.data === z) {
        return zObj[i];
      }
    }
    return -1;
  }

  setTorso(id: number, z: string, next: () => void) {
    this.loadImage(`${this.getPath('Skin', id)}stand${this.parts.stand}.0.body.png`, (image) => {
      const { position } = this.body[`stand${this.parts.stand}`].body;
      this.canvas.drawImage(image, this.offsetX + position.x, this.offsetY + position.y);
      next();
    });
  }

  setHead(id: number, z: string, next: () => void) {
    this.loadImage(`${this.getPath('Skin', id)}front.head.png`, (image) => {
      const { position } = this.body[`stand${this.parts.stand}`].head;
      this.canvas.drawImage(image, this.offsetX + position.x, this.offsetY + position.y);
      next();
    });
  }

  setHands(id: number, z: string, next: () => void) {
    const file = `${this.getPath('Skin', id)}stand${this.parts.stand}.0.hand.png`;
    if (!fs.existsSync(file)) return next();
    this.loadImage(file, (image) => {
      const { position } = this.body[`stand${this.parts.stand}`].hand;
      this.canvas.drawImage(image, this.offsetX + position.x, this.offsetY + position.y);
      next();
    });
  }

  setArm(id: number, z: string, next: () => void) {
    this.loadImage(`${this.getPath('Skin', id)}stand${this.parts.stand}.0.arm.png`, (image) => {
      const { position } = this.body[`stand${this.parts.stand}`].arm;
      this.canvas.drawImage(image, this.offsetX + position.x, this.offsetY + position.y);
      next();
    });
  }

  equipItems(player: Player, items: EqiupItem[], callback: (player: Player) => void, index = 0) {
    if (index >= items.length - 1) {
      return callback(player);
    }

    const item = items[index];
    let { id } = item.parameters;
    let { z } = item.parameters;

    if (typeof id === 'undefined') {
      if (z === 'mailChestOverHighest' || z === 'mailChest') {
        id = 1040036;
        z = 'mailChest';
        item.method = this.setCoat;
      } else {
        return this.equipItems(player, items, callback, ++index);
      }
    }
    const method = item.method.bind(this);
    method(id, z, () => this.equipItems(player, items, callback, ++index));
  }

  setWeaponInfo(id: number) {
    const file = this.parser.parseFromString(
      fs.readFileSync(`${__dirname}/gd//Weapon/0${id}.img/coord.xml`, 'utf8'),
      'text/xml'
    );
    const info = file.getElementsByTagName('_info')[0].getElementsByTagName('stand')[0].getElementsByTagName('value')[0]
      .firstChild.data;
    this.parts.stand = parseInt(info);
  }
}
