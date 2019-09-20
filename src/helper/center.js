import paper from '@scratch/paper';
import {clearSelection} from './selection';
import {getHitBounds} from './bitmap';
import {ART_BOARD_WIDTH, ART_BOARD_HEIGHT} from './view';
import {createCanvas, getRaster} from './layer';


/**
 * calculate the vector how the sprite has to be moved to be centered
 *
 * @param {*} bounds object, needs x,y,width and height
 * @return {object} a vector object, has x and y
 */
const getTranslateVector_ = function (bounds) {
    const centerSprite = new paper.Point(((bounds.x * 2) + bounds.width) / 2, ((bounds.y * 2) + bounds.height) / 2);
    const centerBoard = new paper.Point(ART_BOARD_WIDTH / 2, ART_BOARD_HEIGHT / 2);
    return centerBoard.subtract(centerSprite);
};

/**
 * center the current vector image
 */
const centerVector_ = function () {
    const translateVector = getTranslateVector_(paper.project.activeLayer.internalBounds);
    paper.project.activeLayer.translate(translateVector);
};

/**
 * center the current bitmap image
 */
const centerBitmap_ = function () {
    const canvas = getRaster().canvas;
    const translateVector = getTranslateVector_(getHitBounds(getRaster()));

    const tmpCanvas = createCanvas(canvas.width, canvas.height);
    const context = tmpCanvas.getContext('2d');
    context.save();
    context.translate(translateVector.x, translateVector.y);
    context.drawImage(canvas, 0, 0);
    context.restore();
    getRaster().canvas = tmpCanvas;
};

/**
 * call this to center the current sprite
 *
 * @param {function} onUpdateImage callback after the images is updated
 * @param {boolean} isBitmap boolean if current image is a bitmap or vector
 * @param {function} clearSelectedItems callback executed for delselecting the current selection
 */
const center = function (onUpdateImage, isBitmap, clearSelectedItems) {
    clearSelection(clearSelectedItems);
    if (isBitmap) {
        centerBitmap_();
    } else {
        centerVector_();
    }
    onUpdateImage();
};
export {
    center
};
