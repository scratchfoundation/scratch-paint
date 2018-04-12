import paper from '@scratch/paper';
import {getRaster} from '../layer';
import {line, fillEllipse} from '../bitmap';

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
        this.lastPoint = null;
    }
    setColor (color) {
        this.color = color;
    }
    setBrushSize (size) {
        // For performance, make sure this is an integer
        this.size = ~~size;
    }
    // Draw a brush mark at the given point
    draw (x, y) {
        getRaster().drawImage(this.tmpCanvas, new paper.Point(x - ~~(this.size / 2), y - ~~(this.size / 2)));
    }
    handleMouseDown (event) {
        if (event.event.button > 0) return; // only first mouse button
        this.active = true;

        this.tmpCanvas = document.createElement('canvas');
        this.tmpCanvas.width = this.size;
        this.tmpCanvas.height = this.size;
        const context = this.tmpCanvas.getContext('2d');
        context.imageSmoothingEnabled = false;
        context.fillStyle = this.color;
        // Small squares for pixel artists
        if (this.size <= 4) {
            context.fillRect(0, 0, this.size, this.size);
        } else {
            fillEllipse(this.size / 2, this.size / 2, this.size / 2, this.size / 2, context);
        }

        this.draw(event.point, event.point);
        this.lastPoint = event.point;
    }
    handleMouseDrag (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseDrag(event);
            return;
        }
        line(this.lastPoint, event.point, this.draw.bind(this));
        this.lastPoint = event.point;
    }
    handleMouseUp (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button
        
        line(this.lastPoint, event.point, this.draw.bind(this));
        this.onUpdateSvg();

        this.tmpCanvas = null;
        this.lastPoint = null;
        this.active = false;
    }
    deactivateTool () {
    }
}

export default BrushTool;
