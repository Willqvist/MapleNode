import Http from '../../API/Http.js';
import PopupForm from '../popup/PopupForm.js';
import Url from '../../API/Url.js';
import Panel from "./Panel.js";
import List from "../../list.js";
import PopupProvider from "../popup/PopupProvider.js";
import ImagesPanel from "./ImagesPanel.js";

export default class DownloadPanel extends Panel {


  init() {
    this.remove = PopupProvider.get('removePopup');
    this.remove.bindButton(this.getAll('remove'), this.onRemoveDownload.bind(this));

    this.one = PopupProvider.get('onePopup');
    this.one.bindButton(this.getAll('editMirror'), this.onMirrorEdit.bind(this));

    this.three = PopupProvider.get('threePopup');
    this.three.onClick('input_2',this.onImageClick.bind(this));
    this.three.bindButton(this.getAll('popup-trigger'), this.onPopupClick.bind(this));

    this.downloadList = new List("Downloads");

    this.filePopup = PopupProvider.get("filePopup");
    this.filePopup.onClick('mod_grid_fg',this.onImageSelectClick.bind(this));
    Array.from(this.three.DOM.getElementsByClassName('input_2')).forEach(inp => inp.readOnly = true);

    this.filePopup.setPanel(new ImagesPanel('filePopup'),(node)=> {
      node.getElementsByClassName('mod_grid_fg')[0].addEventListener("click",()=> {
        this.onImageSelectClick.bind(this)(node.getElementsByClassName('mod_grid_fg')[0]);
      }, false);
    });
    this.bindPanels();
  }

  async onImageChange(elem) {
    console.log(elem);
    const { hide } = await this.filePopup.show(elem, this.onFileSelect.bind(this));
    const url = new Url('./dashboard/download/image', {
      image: hide,
      id:elem.id
    });
    const response = await Http.PUT(url);
    if(response.reason || !response.success) return { error: response.reason };
    console.log(elem);
  }

  async onImageClick(inp) {
    const input = inp;
    inp.readOnly = true;
    const {hide} = await this.filePopup.show(inp, this.onFileSelect.bind(this));
    if(hide)
      input.value = hide;
    return true;
  }

  async onImageSelectClick(elem) {
    const id = elem.parentNode.parentNode.id.replace("grid_item_","");
    this.filePopup.hide(id);
  }

  async onFileSelect(state, data, popup) {
    return {error: false};
  }

  async onMirrorEdit(state, data, popup) {
    return {error:false};
  }

  // eslint-disable-next-line class-methods-use-this
  async onRemoveDownload(state, data) {
    if (state === PopupForm.RESULT && !data.close) {
      const url = new Url('./dashboard/download', {
        id: data.id,
      });
      const response = await Http.DELETE(url);
      if(response.reason || !response.success) return { error: response.reason };
      this.downloadList.remove(data.id);
      return { error: response.reason };
    }
    return { error: false };
  }

  readDownload(elem) {
    const parent = elem.parentNode.parentNode.parentNode;
    const parentHeight = parent.getElementsByClassName("heightDownloadContent")[0];
    const height = parseInt(parentHeight.getAttribute("height"), 10)*4+15;
    const id = parent.getAttribute("list-id");
    console.log(elem.parentNode.parentNode.parentNode, height);
    this.downloadList.openExtend(id, height);
  }

  buildExtendedContent(list, data) {
    let html = `
        <div class="mod_list_add_mirror">
            <span>Image</span>
            <i class="fas fa-exchange-alt mod_list_icon info" data-info="Change image"></i>
        </div>
    <div class="mod_list_download_header" style="background:url(upload/${data.input_2}) no-repeat; background-size:cover; background-position: 50% 50%;" >
    </div>
        <div class="mod_list_add_mirror">
            <span>Mirrors</span>
            <i class="fas fa-plus mod_list_icon info" data-info="Add mirror"></i>
        </div>
    `;
    html += `<div class="content_list heightDownloadContent" height="1">`;
    html += `<div class="mod_list_main">
              <i class="fas fa-link mod_list_icon"></i>
              <div class="mod_list_item_content">
                  <div class="mod_list_item_top">
                      <p>Mirror 1</p>
                  </div>
                  <div class="mod_list_break"></div>
                  <div class="mod_list_item_bottom">
                      <ul>
                          <li><strong>Url</strong><span>${data.input_2}</span></li>
                      </ul>
                  </div>
              </div>
              <div class="mod_list_item_btns mod_list_btn" id="${data.id},${data.input_2}">
                  <i class="fas fa-edit info popup-trigger editMirror" trigger="onePopup" popup-data="#mirror=src,<.id=id,#Edit Mirror=title,#Name=label_1<<>div>div[2]>ul>li>span=input_1#Edit=submit" data-info="Edit mirror"></i>
                  <i class="fas fa-trash-alt info" data-info="Remove mirror"></i>
              </div>
          </div>`;
    return html;
  }

  addList(list, data) {
    const obj = {
      icon: 'fas fa-download',
      id: data.id,
      name: data.input_1,
      buttons: [
        {
          icon:'fas fa-book',
          content:'',
          attribs:{
            class:'btn-icon info panel-bind',
            event:"click",
            method:"readDownload",
            'data-info': 'More'
          }
        },
        {
          icon:'fas fa-trash-alt',
          content:'',
          attribs:{
            class:'btn-icon info popup-trigger remove',
            trigger:'removePopup',
            'popup-data': '#download=src,<.id=id,#Are you sure?=title,#Yes remove it=submit',
            'data-info': 'Remove'
          }
        },
      ],
      extended: this.buildExtendedContent(list, data)
    }
    const node =  list.append(obj);
    this.registerTrigger(node);
    this.remove.bindButton(node.getElementsByClassName('remove'), this.onRemoveDownload.bind(this));
    this.bindPanel(node.getElementsByClassName('panel-bind')[0]);
    return node;
  }

  async onPopupClick(state, input) {
    const data = input;
    if (state === PopupForm.RESULT && !data.close) {
      console.log("LENGHT: ",data.input_2.length);
      if (data.input_1.length === 0 || (data.input_2.length === 0 || data.input_2.charAt(0) === ' ') || data.input_3.length === 0) {
        return { error: 'Please fill in all the fields!' };
      }
      let response;
      let url;
      if (data.id === '-1') {
        url = new Url('./dashboard/download', {
          name: data.input_1,
          image:data.input_2,
          url: data.input_3
        });
        response = await Http.POST(url);
        if(response.reason || !response.success) return { error: response.reason };
        data.id = response.id;
        this.addList(this.downloadList, data);
        return { response };
      }
      url = new Url('./dashboard/download', {
        key: data.id,
        name: data.input_1,
        url: data.input_2,
      });
      response = await Http.UPDATE(url);
      return { error: response.reason };
    }
    return { error: false };
  }

  async onExit() {
    super.onExit();
  }

  async onFocus() {
    super.onFocus();
  }
}
