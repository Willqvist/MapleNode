import { sleep } from '../tools/Tools.js';
import AttributeParser from '../tools/AttributeParser.js';

async function parseData(data) {
  const obj = {};
  if(!data) return {};
  for (let i = 0; i < data.length; i++) {
    if(data[i].getAttribute('type') === 'file') {
      obj[data[i].getAttribute('name')] = data[i].files[0];
    } else {
      obj[data[i].getAttribute('name')] = data[i].value;
    }
  }
  return obj;
}

const popupStack = [];
popupStack.peek = function () {
  return popupStack[popupStack.length-1];
}
popupStack.empty = function () {
  return popupStack.length === 0;
}


export default class PopupForm {

  constructor(id) {
    this.id = id;
    this.visible = false;
    this.parsedData = {};
    this.DOM = document.getElementById(id);
    const [title] = this.DOM.getElementsByClassName('title');
    const [error] = this.DOM.getElementsByClassName('error_popup');
    this.title = title;
    this.error = error;
    this.parent = this.DOM.parentElement;
    if (!this.DOM.className.includes('popup') || !this.parent.className.includes('popups')) {
      throw new Error('DOM object does not contain popup classname');
    }
    const [form] = this.DOM.getElementsByTagName('form');
    this.form = form;
    this.fields = this.form.querySelectorAll('input,select,textarea');

    this.form.onsubmit = (e) => {
      e.preventDefault();
    };

    const [close] = this.DOM.getElementsByClassName('close');
    this.close = close;
    this.initAttributes();

    document.addEventListener(
      'keyup',
      (e) => {
        if (e.key === 'Escape' && this.visible && PopupForm.inFocus === this) {
          console.log("THIS:",this);
          if(popupStack.peek() === this) {
            this.fieldResolve({close: true});
            this.fieldResolve = null;
          }
        }
      },
      false
    );
  }

  onClick(element, callback) {
    const elems = this.DOM.getElementsByClassName(element);
    for(let i = 0; i < elems.length; i++) {
      const elem = elems[i];
      const method = async ()=> {
        await callback(elem);
      };
      elem.addEventListener("click", method);
      elem.addEventListener("focus", method);
    }
  }

  initAttributes() {
    this.attribs = {};
    const atcls = this.DOM.getElementsByClassName('attrib');
    for (let i = 0; i < atcls.length; i++) {
      this.attribs[atcls[i].getAttribute('name')] = atcls[i];
    }
  }

  async animateIn() {
    if (this.visible) return;
    this.visible = true;
    this.parent.style.display = 'flex';
    this.DOM.style.display = 'block';
    await sleep(1);
    this.DOM.style.transform = 'scale(1)';
    this.parent.style.opacity = '1';
    this.DOM.style.opacity = '1';
  }

  async animateOut() {
    if (!this.visible) return;
    this.visible = false;
    if(popupStack.empty())
      this.parent.style.opacity = '0';
    this.DOM.style.opacity = '0';
    this.DOM.style.transform = 'scale(0.9)';
    await sleep(220);
    if(popupStack.empty())
      this.parent.style.display = 'none';
    this.DOM.style.display = 'none';
    this.DOM.style.transform = 'scale(1.1)';
  }

  hide(data) {
    if(this.fieldResolve) {
      this.fieldResolve({error: false, hide:data});
    }
  }

  async show(elem, clb) {
    popupStack.push(this);
    await this.animateIn();
    const data = await this.getFields();
    this.fieldResolve = null;
    const submitText = this.title.textContent;
    this.title.innerHTML += '<i class="fas fa-circle-notch fa-spin"></i>';
    let parsed = data;
    if (!data.close) {
      parsed = await parseData(data.parse);
      parsed.close = data.close;
    }

    const res = await clb(PopupForm.RESULT, parsed, this);
    this.title.innerHTML = submitText;
    if (res.error) {
      this.showError(res.error);
      return this.show(elem, clb);
    }
    if (!data.close) {
      this.fillBindedData(elem.getAttribute('popup-id'), this.parsedData[elem.getAttribute('popup-id')]);
    }
    this.hideError();
    popupStack.pop();
    await this.animateOut();
    parsed.hide = data.hide;
    return parsed;
  }

  showError(msg) {
    console.log('showing error!');
    this.error.innerHTML = msg;
    this.error.style.opacity = '1';
    this.error.style.marginBottom = '2rem';
    this.error.style.padding = '1rem 1rem';
    this.error.style.height = 'auto';
  }

  hideError() {
    this.error.style.opacity = '0';
    this.error.style.marginBottom = '0rem';
    this.error.style.padding = '0rem 1rem';
    this.error.style.height = '0';
  }

  getFields() {
    return new Promise((resolve) => {
      this.fieldResolve = resolve;
      this.form.onsubmit = (e) => {
        e.preventDefault();
        resolve({ close: false, parse: this.fields });
      };
      if (this.close) {
        this.close.addEventListener(
          'click',
          (e) => {
            if(popupStack.peek() === this)
              resolve({ close: true });
          },
          false
        );
      }
    });
  }

  bindAttribToDOM(attribs) {
    if (!attribs) return;
    for (const key in attribs) {
      if (key === 'nodes') continue;
      const dom = this.attribs[key];
      if (!dom) continue;
      if (dom.tagName === 'INPUT') {
        dom.value = attribs[key];
      } else {
        dom.innerHTML = attribs[key];
      }
    }
  }

  fillBindedData(id, attribs) {
    if (!attribs) return;
    for (const key in attribs) {
      if (key === 'nodes') continue;
      const elem = attribs.nodes[key];
      if (elem) {
        elem.innerHTML = this.attribs[key].value;
        this.parsedData[id][key] = this.attribs[key].value;
      }
    }
  }

  bindEventListener(elem, clb) {
    if (elem.hasAttribute('popup-data')) {
      const bind = AttributeParser.parse(elem, elem.getAttribute('popup-data'));
      elem.setAttribute('popup-id', bind.id);
      this.parsedData[bind.id] = bind.data;
    }

    elem.addEventListener(
      'click',
      (e) => {
        clb(PopupForm.CLICK, e, this).then((res) => {
          if (res.error) {
            this.showError(res.error);
          }
          this.bindAttribToDOM(this.parsedData[elem.getAttribute('popup-id')]);
          this.show(elem, clb).then(() => {});
        });
      },
      false
    );
  }

  bindButton(btn, clb) {
    if (btn instanceof HTMLCollection) {
      for (let i = 0; i < btn.length; i++) {
        this.bindEventListener(btn[i], clb);
      }
    } else {
      this.bindEventListener(btn, clb);
    }
  }
}
PopupForm.CLICK = 0;
PopupForm.RESULT = 1;
