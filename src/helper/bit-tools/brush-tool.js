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
        this.lastPoint = null;
        this.size = 5;
    }
    setColor (color) {
        this.color = color;
    }
    bresenhamLine (point1, point2, callback){
        // Fast Math.floor
        let x1 = ~~point1.x;
        let x2 = ~~point2.x;
        let y1 = ~~point1.y;
        let y2 = ~~point2.y;
        
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = (x1 < x2) ? 1 : -1;
        const sy = (y1 < y2) ? 1 : -1;
        let err = dx - dy;
        
        callback(x1, y1);
        while (x1 !== x2 || y1 !== y2) {
            let e2 = err*2;
            if (e2 >-dy) {
                err -= dy; x1 += sx;
            }
            if (e2 < dx) {
                err += dx; y1 += sy;
            }
            callback(x1, y1);
        }
    }
    // Draw a brush mark at the given point
    draw (centerX, centerY) {
        for (let x = centerX - this.size; x <= centerX + this.size; x++) {
            for (let y = centerY - this.size; y <= centerY + this.size; y++) {
                getRaster().setPixel(new paper.Point(x, y), this.color);
            }
        }
    }
    handleMouseDown (event) {
        if (event.event.button > 0) return; // only first mouse button
        this.active = true;
        this.draw(event.point, event.point);
        this.lastPoint = event.point;
    }
    handleMouseDrag (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseDrag(event);
            return;
        }
        this.bresenhamLine(this.lastPoint, event.point, this.draw.bind(this));
        this.lastPoint = event.point;
    }
    handleMouseUp (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button
        this.bresenhamLine(this.lastPoint, event.point, this.draw.bind(this));
        this.lastPoint = null;
        this.active = false;
    }
    deactivateTool () {
    }
}

export default BrushTool;
