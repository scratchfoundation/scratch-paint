import paper from '@scratch/paper';
import {getRaster} from '../layer';
import {forEachLinePoint, fillEllipse} from '../bitmap';
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
        // For performance, make sure this is an integer
        this.size = Math.max(1, ~~size);
    }
    // Draw a brush mark at the given point
    draw (x, y) {
        const roundedUpRadius = Math.ceil(this.size / 2);
        getRaster().drawImage(this.tmpCanvas, new paper.Point(~~x - roundedUpRadius, ~~y - roundedUpRadius));
    }
    updateCursorIfNeeded () {
        if (!this.size) {
            return;
        }
        // The cursor preview was unattached from the view by an outside process,
        // such as changing costumes or undo.
        if (this.cursorPreview && !this.cursorPreview.parent) {
            this.cursorPreview = null;
        }

        if (!this.cursorPreview || !(this.lastSize === this.size && this.lastColor === this.color)) {
            if (this.cursorPreview) {
                this.cursorPreview.remove();
            }

            this.tmpCanvas = document.createElement('canvas');
            const roundedUpRadius = Math.ceil(this.size / 2);
            this.tmpCanvas.width = roundedUpRadius * 2;
            this.tmpCanvas.height = roundedUpRadius * 2;
            const context = this.tmpCanvas.getContext('2d');
            context.imageSmoothingEnabled = false;
            context.fillStyle = this.color;
            // Small squares for pixel artists
            if (this.size <= 5) {
                if (this.size % 2) {
                    context.fillRect(1, 1, this.size, this.size);
                } else {
                    context.fillRect(0, 0, this.size, this.size);
                }
            } else {
                const roundedDownRadius = ~~(this.size / 2);
                fillEllipse(roundedDownRadius, roundedDownRadius, roundedDownRadius, roundedDownRadius, context);
            }

            this.cursorPreview = new paper.Raster(this.tmpCanvas);
            this.cursorPreview.guide = true;
            this.cursorPreview.parent = getGuideLayer();
            this.cursorPreview.data.isHelperItem = true;
        }
        this.lastSize = this.size;
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
        forEachLinePoint(this.lastPoint, event.point, this.draw.bind(this));
        this.lastPoint = event.point;
    }
    handleMouseUp (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button
        
        forEachLinePoint(this.lastPoint, event.point, this.draw.bind(this));
        this.onUpdateSvg();

        this.lastPoint = null;
        this.active = false;

        this.updateCursorIfNeeded();
        this.cursorPreview.position = new paper.Point(~~event.point.x, ~~event.point.y);
    }
    deactivateTool () {
        this.active = false;
        this.tmpCanvas = null;
        if (this.cursorPreview) {
            this.cursorPreview.remove();
            this.cursorPreview = null;
        }
    }
}

export default BrushTool;
