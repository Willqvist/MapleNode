import PopupForm from './PopupForm.js';
import FileUploadPopupForm from "./FileUploadPopupForm.js";

function createPopup(id) {
  switch(id) {
    case 'uploadFilePopup': return new FileUploadPopupForm(id);
    default: return new PopupForm(id);
  }
}

export default class PopupProvider {
  static get(id) {
    if (!PopupProvider.popups[id]) {
      PopupProvider.popups[id] = createPopup(id);
    }
    return PopupProvider.popups[id];
  }
}
PopupProvider.popups = {};
PopupProvider.instances = 0;
