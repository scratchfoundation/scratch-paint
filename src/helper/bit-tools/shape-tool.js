import paper from '@scratch/paper';
import {getRaster} from '../layer';
import {clearSelection} from '../selection';
import {getSquareDimensions} from '../math';
import BoundingBoxTool from '../selection-tools/bounding-box-tool';
import NudgeTool from '../selection-tools/nudge-tool';

/**
 * Tool for drawing shapes (e.g. rectangles and ovals).
 */
class ShapeTool extends paper.Tool {
    static get TOLERANCE () {
        return 2;
    }
    /**
     * @param {function} setSelectedItems Callback to set the set of selected items in the Redux state
     * @param {function} clearSelectedItems Callback to clear the set of selected items in the Redux state
     * @param {function} setCursor Callback to set the visible mouse cursor
     * @param {!function} onUpdateImage A callback to call when the image visibly changes
     * @param {BitmapModes} mode This tool's "mode"
     */
    constructor (setSelectedItems, clearSelectedItems, setCursor, onUpdateImage, mode) {
        super();
        this.setSelectedItems = setSelectedItems;
        this.clearSelectedItems = clearSelectedItems;
        this.onUpdateImage = onUpdateImage;
        this.boundingBoxTool = new BoundingBoxTool(
            mode,
            setSelectedItems,
            clearSelectedItems,
            setCursor,
            onUpdateImage
        );
        const nudgeTool = new NudgeTool(this.boundingBoxTool, onUpdateImage);

        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDown = this.handleMouseDown;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseMove = this.handleMouseMove;
        this.onMouseUp = this.handleMouseUp;
        this.onKeyUp = nudgeTool.onKeyUp;
        this.onKeyDown = nudgeTool.onKeyDown;

        this.shape = null;
        this.shapeType = null;
        this.color = null;
        this.active = false;
    }
    getHitOptions () {
        return {
            segments: false,
            stroke: true,
            curves: false,
            fill: true,
            guide: false,
            match: hitResult =>
                (hitResult.item.data && (hitResult.item.data.isScaleHandle || hitResult.item.data.isRotHandle)) ||
                hitResult.item.selected, // Allow hits on bounding box and selected only
            tolerance: ShapeTool.TOLERANCE / paper.view.zoom
        };
    }
    /**
     * Should be called if the selection changes to update the bounds of the bounding box.
     * @param {Array<paper.Item>} selectedItems Array of selected items.
     */
    onSelectionChanged (selectedItems) {
        this.boundingBoxTool.onSelectionChanged(selectedItems);
        if ((!this.shape || !this.shape.isInserted()) &&
                selectedItems && selectedItems.length === 1 && selectedItems[0].shape === this.shapeType) {
            // Infer that an undo occurred and get back the active shape
            this.shape = selectedItems[0];
            if (this.shape.data.zoomLevel !== paper.view.zoom) {
                this.shape.strokeWidth = this.shape.strokeWidth / this.shape.data.zoomLevel * paper.view.zoom;
                this.shape.data.zoomLevel = paper.view.zoom;
                this.thickness = this.shape.strokeWidth;
            }
            this.filled = this.shape.strokeWidth === 0;
            const color = this.filled ? this.shape.fillColor : this.shape.strokeColor;
            this.color = color ? color.toCSS() : null;
        } else if (this.shape && this.shape.isInserted() && !this.shape.selected) {
            // Shape got deselected
            this.commitShape();
        }
    }
    setColor (color) {
        this.color = color;
        if (this.shape) {
            if (this.filled) {
                this.shape.fillColor = this.color;
            } else {
                this.shape.strokeColor = this.color;
            }
        }
    }
    setFilled (filled) {
        if (this.filled === filled) return;
        this.filled = filled;
        if (this.shape && this.shape.isInserted()) {
            if (this.filled) {
                this.shape.fillColor = this.color;
                this.shape.strokeWidth = 0;
                this.shape.strokeColor = null;
            } else {
                this.shape.fillColor = null;
                this.shape.strokeWidth = this.thickness;
                this.shape.strokeColor = this.color;
            }
            this.onUpdateImage();
        }
    }
    setThickness (thickness) {
        if (this.thickness === thickness * paper.view.zoom) return;
        this.thickness = thickness * paper.view.zoom;
        if (this.shape && this.shape.isInserted() && !this.filled) {
            this.shape.strokeWidth = this.thickness;
        }
        if (this.shape && this.shape.isInserted()) {
            this.shape.data.zoomLevel = paper.view.zoom;
            this.onUpdateImage();
        }
    }
    handleMouseDown (event) {
        if (event.event.button > 0) return; // only first mouse button
        this.active = true;

        if (this.boundingBoxTool.onMouseDown(
            event, false /* clone */, false /* multiselect */, false /* doubleClicked */, this.getHitOptions())) {
            this.isBoundingBoxMode = true;
        } else {
            this.isBoundingBoxMode = false;
            clearSelection(this.clearSelectedItems);
            this.commitShape();

            const shapeOptions = {
                point: event.downPoint,
                strokeScaling: false,
                size: 0,
                strokeJoin: 'round'
            };

            if (this.filled) {
                shapeOptions.fillColor = this.color;
                shapeOptions.strokeWidth = 0;
            } else {
                shapeOptions.strokeColor = this.color;
                shapeOptions.strokeWidth = this.thickness;
            }

            this.shape = new this.shapeConstructor(shapeOptions);
            this.shapeType = this.shape.type;
            this.shape.data = {zoomLevel: paper.view.zoom};
        }
    }
    handleMouseDrag (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseDrag(event);
            return;
        }

        const downPoint = new paper.Point(event.downPoint.x, event.downPoint.y);
        const point = new paper.Point(event.point.x, event.point.y);
        const squareDimensions = getSquareDimensions(event.downPoint, event.point);
        const realSize = downPoint.subtract(point);
        if (event.modifiers.shift) {
            this.shape.size = squareDimensions.size.abs();
        } else {
            // Setting a negative size messes up the shape's radius, so keep it positive.
            this.shape.size = realSize.abs();
        }

        if (event.modifiers.alt) {
            this.shape.position = downPoint;
        } else if (event.modifiers.shift) {
            this.shape.position = squareDimensions.position;
        } else {
            this.shape.position = downPoint.subtract(realSize.multiply(0.5));
        }
    }
    handleMouseMove (event) {
        this.boundingBoxTool.onMouseMove(event, this.getHitOptions());
    }
    handleMouseUp (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseUp(event);
            this.isBoundingBoxMode = null;
            return;
        }

        if (this.shape) {
            if (Math.abs(this.shape.size.width * this.shape.size.height) < ShapeTool.TOLERANCE / paper.view.zoom) {
                // Tiny shape created unintentionally?
                this.shape.remove();
                this.shape = null;
            } else {
                // Hit testing does not work correctly unless the width and height are positive
                this.shape.size = new paper.Point(Math.abs(this.shape.size.width), Math.abs(this.shape.size.height));
                this.shape.selected = true;
                this.setSelectedItems();
            }
        }
        this.active = false;
        this.onUpdateImage();
    }
    commitShape () {
        if (!this.shape || !this.shape.isInserted()) return;

        this.shapeCommitFunction(this.shape, getRaster());
        this.shape.remove();
        this.shape = null;
    }
    deactivateTool () {
        this.commitShape();
        this.boundingBoxTool.deactivateTool();
    }
}

export default ShapeTool;
