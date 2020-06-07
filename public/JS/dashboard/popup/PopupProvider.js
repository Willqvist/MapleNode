import PopupForm from './PopupForm.js';
import FileUploadPopupForm from "./FileUploadPopupForm.js";
import ListPopupForm from "./ListPopup.js";
import FilePopup from "./FilePopup.js";

function createPopup(id) {
  console.log(id);
  switch(id) {
    case 'uploadFilePopup': return new FileUploadPopupForm(id);
    case 'listPopup': return new ListPopupForm(id);
    case 'filePopup': return new FilePopup(id);
    default: return new PopupForm(id);
  }
}

export default class PopupProvider {
  static get(id) {
    /*
    if (!PopupProvider.popups[id]) {
      PopupProvider.popups[id] = createPopup(id);
    }

     */
    return createPopup(id);
  }
}
PopupProvider.popups = {};
PopupProvider.instances = 0;
