import paper from '@scratch/paper';
import { clearSelection } from './selection';
import { getHitBounds } from './bitmap';
import { ART_BOARD_WIDTH, ART_BOARD_HEIGHT } from './view';
import { createCanvas, getRaster } from './layer';

const center = function (onUpdateImage, isBitmap, clearSelectedItems) {
    clearSelection(clearSelectedItems);
    if (isBitmap) {
        _centerBitmap();
    } else {
        _centerVector();
    }
    onUpdateImage();
};
export {
    center
};

function _centerVector() {
    const translateVector = _getTranslateVector(paper.project.activeLayer.internalBounds);
    paper.project.activeLayer.translate(translateVector);
}

function _centerBitmap() {
    const canvas = getRaster().canvas;
    const translateVector = _getTranslateVector(getHitBounds(getRaster()));

    const tmpCanvas = createCanvas(canvas.width, canvas.height);
    const context = tmpCanvas.getContext('2d');
    context.save();
    context.translate(translateVector.x, translateVector.y);
    context.drawImage(canvas, 0, 0);
    context.restore();
    getRaster().canvas = tmpCanvas;
}

function _getTranslateVector(bounds) {
    const centerSprite = new paper.Point((bounds.x * 2 + bounds.width) / 2, (bounds.y * 2 + bounds.height) / 2);
    const centerBoard = new paper.Point(ART_BOARD_WIDTH / 2, ART_BOARD_HEIGHT / 2);
    return centerBoard.subtract(centerSprite);
} 