const STATES = {
  CHILD: 0,
  RENAME: 1,
  END: 2,
  NONE: 3,
  ATTRIBUTE: 3,
  CONST: 5,
};

export default class AttributeParser {
  static parse(focused, str) {
    return AttributeParser.parseAttrib(focused, str, 0);
  }

  static parseAttrib(startNode, string, start) {
    let str = string;
    let node = startNode;
    str = str.replace(/ {2}|\r\n|\n|\r/gm, '');
    const org = node;
    str += '!';
    const buffer = [300];
    let bufferSize = 0;
    let state = null;
    let prevState = null;
    let changedState = false;
    const values = [];
    const renames = [];
    const nodes = [];
    for (let i = start; i < str.length; i++) {
      const chr = str.charAt(i);
      switch (chr) {
        case '<':
          node = node.parentNode;
          continue;
        case '>':
          changedState = true;
          state = STATES.CHILD;
          continue;
        case '.':
          changedState = true;
          state = STATES.ATTRIBUTE;
          continue;
        case '=':
          changedState = true;
          state = STATES.RENAME;
          continue;
        case '#':
          changedState = true;
          state = STATES.CONST;
          continue;
        case '!':
          changedState = true;
          state = STATES.END;
          break;
        case ',':
          node = org;
          continue;
        default:
          break;
      }
      if (prevState != null && changedState) {
        const newStr = buffer.slice(0, bufferSize).join('');
        switch (prevState) {
          case STATES.ATTRIBUTE:
            if (state === STATES.ATTRIBUTE) {
              console.error('[ILLEGAL STATE] Can not have two attributes after eachother');
              return { end: -1, data: {} };
            }
            if (state === STATES.CHILD) {
              console.error('[ILLEGAL STATE] Can not have child after attribute');
              return { end: -1, data: {} };
            }
            values.push(node.getAttribute(newStr));
            nodes.push(null);
            break;
          case STATES.RENAME:
            renames.push(newStr);
            break;
          case STATES.CHILD:
            node = AttributeParser.findChild(node, newStr);
            if (state !== STATES.ATTRIBUTE && state !== STATES.CHILD) {
              values.push(node.textContent);
              nodes.push(node);
            }
            break;
          case STATES.CONST:
            values.push(newStr);
            nodes.push(null);
            break;
          default:
            break;
        }
        bufferSize = 0;
      }
      buffer[bufferSize++] = chr;
      changedState = false;
      prevState = state;
    }
    return {
      end: str.length,
      id: AttributeParser.count++,
      data: AttributeParser.toObject(values, renames, nodes),
    };
  }

  static toObject(values, renames, nodes) {
    const obj = {};
    obj.nodes = {};
    for (let i = 0; i < values.length; i++) {
      if (i < renames.length) {
        obj[renames[i]] = values[i];
        if (nodes[i]) obj.nodes[renames[i]] = nodes[i];
      } else {
        obj[values[i].toString()] = values[i];
        if (nodes[i]) obj.nodes[nodes[i].toString()] = nodes[i];
      }
    }
    return obj;
  }

  static findChild(root, string) {
    let str = string;
    let num = 0;
    if (str.slice(-1) === ']') {
      const i = str.indexOf('[');
      num = parseInt(str.substring(i + 1, str.length - 1), 10);
      str = str.substring(0, i);
    }
    return root.getElementsByTagName(str)[num];
  }
}
AttributeParser.count = 0;
