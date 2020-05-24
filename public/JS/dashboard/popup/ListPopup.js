import PopupForm from "./PopupForm.js";

export default class ListPopupForm extends PopupForm {

    constructor(id) {
        super(id);
        this.list = this.DOM.getElementsByClassName('listElements')[0];
    }

    addToList(value) {
        const child = document.createElement('option');
        child.innerHTML = value;
        this.list.appendChild(child);
    }

    clear() {
        this.list.innerHTML = "";
    }

    asList(list) {
        this.clear();
        for(let i = 0; i < list.length; i++) {
            this.addToList(list[i]);
        }
    }
}
