"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const pngjs_1 = __importDefault(require("pngjs"));
class ImageBuilder {
    loadImage(image, callback) {
        if (!fs_1.default.existsSync(image)) {
            callback(null);
            return;
        }
        fs_1.default.createReadStream(image)
            .pipe(new pngjs_1.default())
            .on('parsed', function () {
            callback(this);
        });
    }
    loadMultibleImages(images, callback) {
        let pngs = [];
        let index = 0;
        let imageLoaded = 0;
        for (let i = 0; i < images.length; i++) {
            this.loadImage(images[i], ((image) => {
                imageLoaded++;
                pngs[i] = image;
                if (imageLoaded >= images.length)
                    callback(pngs);
            }).bind(i));
        }
    }
    outputImage(canvas, src, callback) {
        canvas.image().pack()
            .pipe(fs_1.default.createWriteStream(src))
            .on('finish', function (err) {
            callback();
        });
        canvas.clearCanvas();
    }
}
exports.default = ImageBuilder;
//# sourceMappingURL=ImageBuilder.js.map