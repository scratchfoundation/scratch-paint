import paper from '@scratch/paper';
import {getRaster} from '../layer';

/**
 * Tool for drawing with the bitmap brush.
 */
class BrushTool extends paper.Tool {
    /**
     * @param {!function} onUpdateSvg A callback to call when the image visibly changes
     */
    constructor (onUpdateSvg) {
        super();
        this.onUpdateSvg = onUpdateSvg;
        
        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDown = this.handleMouseDown;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;

        this.colorState = null;
        this.active = false;
    }
    setColorState (colorState) {
        this.colorState = colorState;
    }
    handleMouseDown (event) {
        if (event.event.button > 0) return; // only first mouse button
        this.active = true;
        getRaster().setPixel(event.point, 'blue');
    }
    handleMouseDrag (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseDrag(event);
            return;
        }
        getRaster().setPixel(event.point, 'blue');
    }
    handleMouseUp (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button
        getRaster().setPixel(event.point, 'blue');
        this.active = false;
    }
    deactivateTool () {
    }
}

export default BrushTool;
