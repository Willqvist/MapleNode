import PopupForm from "./PopupForm.js";

export default class FileUploadPopupForm extends PopupForm {

    constructor(id) {
        super(id);
        this.progressBar = document.getElementById("file_progress_bar");
    }

    beginUpload() {

    }

    showProgress(percent) {
        console.log(this.progressBar);
        this.progressBar.style.width = `${percent*100}%`;
    }

    doneUpload() {

    }
}
