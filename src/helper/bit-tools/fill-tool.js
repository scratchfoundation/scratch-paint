import paper from '@scratch/paper';
import {floodFill, floodFillAll} from '../bitmap';
import {getRaster} from '../layer';

/**
 * Tool for drawing fills.
 */
class FillTool extends paper.Tool {
    /**
     * @param {!function} onUpdateImage A callback to call when the image visibly changes
     */
    constructor (onUpdateImage) {
        super();
        this.onUpdateImage = onUpdateImage;
        
        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDown = this.handleMouseDown;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;

        this.color = null;
        this.changed = false;
        this.active = false;
    }
    setColor (color) {
        this.color = color ? color : 'rgba(0,0,0,0)';
    }
    handleMouseDown (event) {
        const context = getRaster().getContext('2d');
        if (event.event.shiftKey) {
            this.changed = floodFillAll(event.point.x, event.point.y, this.color, context) || this.changed;
        } else {
            this.changed = floodFill(event.point.x, event.point.y, this.color, context) || this.changed;
        }
    }
    handleMouseDrag (event) {
        const context = getRaster().getContext('2d');
        if (event.event.shiftKey) {
            this.changed = floodFillAll(event.point.x, event.point.y, this.color, context) || this.changed;
        } else {
            this.changed = floodFill(event.point.x, event.point.y, this.color, context) || this.changed;
        }
    }
    handleMouseUp () {
        if (this.changed) {
            this.onUpdateImage();
            this.changed = false;
        }
    }
    deactivateTool () {
        if (this.changed) {
            this.onUpdateImage();
            this.changed = false;
        }
    }
}

export default FillTool;
