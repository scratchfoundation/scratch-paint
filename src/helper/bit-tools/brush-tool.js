import paper from '@scratch/paper';
import {getRaster} from '../layer';
import {line, fillEllipse} from '../bitmap';
import {getGuideLayer} from '../layer';

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
        this.onMouseMove = this.handleMouseMove;
        this.onMouseDown = this.handleMouseDown;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;

        this.colorState = null;
        this.active = false;
        this.lastPoint = null;
        this.cursorPreview = null;
    }
    setColor (color) {
        this.color = color;
    }
    setBrushSize (size) {
        // TODO get 1px to work
        // For performance, make sure this is an integer
        this.radius = Math.max(1, ~~(size / 2));
    }
    // Draw a brush mark at the given point
    draw (x, y) {
        getRaster().drawImage(this.tmpCanvas, new paper.Point(~~x - this.radius, ~~y - this.radius));
    }
    updateCursorIfNeeded () {
        if (!this.radius) {
            return;
        }
        // The cursor preview was unattached from the view by an outside process,
        // such as changing costumes or undo.
        if (this.cursorPreview && !this.cursorPreview.parent) {
            this.cursorPreview = null;
        }

        if (!this.cursorPreview || !(this.lastRadius === this.radius && this.lastColor === this.color)) {
            if (this.cursorPreview) {
                this.cursorPreview.remove();
            }

            this.tmpCanvas = document.createElement('canvas');
            this.tmpCanvas.width = this.radius * 2;
            this.tmpCanvas.height = this.radius * 2;
            const context = this.tmpCanvas.getContext('2d');
            context.imageSmoothingEnabled = false;
            context.fillStyle = this.color;
            // Small squares for pixel artists
            if (this.radius <= 2) {
                context.fillRect(0, 0, this.radius * 2, this.radius * 2);
            } else {
                fillEllipse(this.radius, this.radius, this.radius, this.radius, context);
            }

            this.cursorPreview = new paper.Raster(this.tmpCanvas);
            this.cursorPreview.guide = true;
            this.cursorPreview.parent = getGuideLayer();
            this.cursorPreview.data.isHelperItem = true;
        }
        this.lastRadius = this.radius;
        this.lastColor = this.color;
    }
    handleMouseMove (event) {
        this.updateCursorIfNeeded();
        this.cursorPreview.position = new paper.Point(~~event.point.x, ~~event.point.y);
    }
    handleMouseDown (event) {
        if (event.event.button > 0) return; // only first mouse button
        this.active = true;
        
        this.cursorPreview.remove();

        this.draw(event.point.x, event.point.y);
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

        this.lastPoint = null;
        this.active = false;

        this.updateCursorIfNeeded();
        this.cursorPreview.position = new paper.Point(~~event.point.x, ~~event.point.y);
    }
    deactivateTool () {
        this.active = false;
        this.tmpCanvas = null;
        this.cursorPreview.remove();
        this.cursorPreview = null;
    }
}

export default BrushTool;
