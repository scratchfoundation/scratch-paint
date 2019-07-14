import paper from '@scratch/paper';
import { clearSelection} from './selection';
import {ART_BOARD_WIDTH, ART_BOARD_HEIGHT} from './view';

const center = function (onUpdateImage, isBitmap, clearSelectedItems) {
    if (isBitmap) {
        console.log("bitmap");
    }  else{
        clearSelection(clearSelectedItems);
        window.paper = paper;
        const bounds = paper.project.activeLayer.internalBounds;
        const centerSprite = new paper.Point((bounds.x * 2 + bounds.width) / 2 , (bounds.y * 2 + bounds.height) / 2);
        const centerBoard = new paper.Point(ART_BOARD_WIDTH /2 , ART_BOARD_HEIGHT /2);
        const translateVector = centerBoard.subtract(centerSprite);
        paper.project.activeLayer.translate(translateVector);
    } 
    onUpdateImage();
};
export {
    center
};
