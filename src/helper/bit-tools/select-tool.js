import paper from '@scratch/paper';
import Modes from '../../lib/modes';

import {getSelectedLeafItems} from '../selection';
import {createCanvas, getRaster} from '../layer';
import {drawRect} from '../bitmap';
import {ART_BOARD_WIDTH, ART_BOARD_HEIGHT} from '../view';

import BoundingBoxTool from '../selection-tools/bounding-box-tool';
import NudgeTool from '../selection-tools/nudge-tool';
import SelectionBoxTool from '../selection-tools/selection-box-tool';

/**
 * paper.Tool that handles select mode in bitmap. This is made up of 2 subtools.
 * - The selection box tool is active when the user clicks an empty space and drags.
 *   It selects all items in the rectangle.
 * - The bounding box tool is active if the user clicks on a non-empty space. It handles
 *   reshaping the selection.
 */
class SelectTool extends paper.Tool {
    /** The distance within which mouse events count as a hit against an item */
    static get TOLERANCE () {
        return 6;
    }
    /**
     * @param {function} setSelectedItems Callback to set the set of selected items in the Redux state
     * @param {function} clearSelectedItems Callback to clear the set of selected items in the Redux state
     * @param {!function} onUpdateImage A callback to call when the image visibly changes
     */
    constructor (setSelectedItems, clearSelectedItems, onUpdateImage) {
        super();
        this.onUpdateImage = onUpdateImage;
        this.boundingBoxTool = new BoundingBoxTool(Modes.SELECT, setSelectedItems, clearSelectedItems, onUpdateImage);
        const nudgeTool = new NudgeTool(this.boundingBoxTool, onUpdateImage);
        this.selectionBoxTool = new SelectionBoxTool(Modes.SELECT, setSelectedItems, clearSelectedItems);
        this.selectionBoxMode = false;
        this.selection = null;
        this.active = false;

        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDown = this.handleMouseDown;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;
        this.onKeyUp = nudgeTool.onKeyUp;
        this.onKeyDown = nudgeTool.onKeyDown;

        this.boundingBoxTool.setSelectionBounds();
    }
    /**
     * Should be called if the selection changes to update the bounds of the bounding box.
     * @param {Array<paper.Item>} selectedItems Array of selected items.
     */
    onSelectionChanged (selectedItems) {
        this.boundingBoxTool.onSelectionChanged(selectedItems);
    }
    /**
     * Returns the hit options to use when conducting hit tests.
     * @param {boolean} preselectedOnly True if we should only return results that are already
     *     selected.
     * @return {object} See paper.Item.hitTest for definition of options
     */
    getHitOptions (preselectedOnly) {
        // Tolerance needs to be scaled when the view is zoomed in in order to represent the same
        // distance for the user to move the mouse.
        const hitOptions = {
            segments: true,
            stroke: true,
            curves: true,
            fill: true,
            guide: false,
            tolerance: SelectTool.TOLERANCE / paper.view.zoom
        };
        if (preselectedOnly) {
            hitOptions.selected = true;
        }
        return hitOptions;
    }
    handleMouseDown (event) {
        if (event.event.button > 0) return; // only first mouse button
        this.active = true;

        // If bounding box tool does not find an item that was hit, rasterize the old selection,
        // then use selection box tool.
        if (!this.boundingBoxTool
            .onMouseDown(
                event,
                event.modifiers.alt,
                event.modifiers.shift,
                this.getHitOptions(false /* preseelectedOnly */))) {
            this.commitSelection();
            this.selectionBoxMode = true;
            this.selectionBoxTool.onMouseDown(event.modifiers.shift);
        }
    }
    handleMouseDrag (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.selectionBoxMode) {
            this.selectionBoxTool.onMouseDrag(event);
        } else {
            this.boundingBoxTool.onMouseDrag(event);
        }
    }
    handleMouseUp (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.selectionBoxMode) {
            this.selectionBoxTool.onMouseUpBitmap(event);
        } else {
            this.boundingBoxTool.onMouseUp(event);
        }
        this.selectionBoxMode = false;
        this.active = false;
    }
    commitSelection () {
        const selection = getSelectedLeafItems();

        for (const item of selection) {
            // @todo handle non-rasters?
            // @todo handle undo state
            if (!(item instanceof paper.Raster) && item.data.expanded) continue;
            // In the special case that there is no rotation
            if (item.matrix.b === 0 && item.matrix.c === 0) {
                this.commitScaleTransformation(item);
            } else {
                this.commitArbitraryTransformation(item);
            }
        }
    }
    commitScaleTransformation (item) {
        // context.drawImage will anti-alias the image if both width and height are reduced.
        // However, it will preserve pixel colors if only one or the other is reduced, and
        // imageSmoothingEnabled is set to false. Therefore, we can avoid aliasing by scaling
        // down images in a 2 step process.

        // @todo: Currently, we can't avoid anti-aliasing when the image is both scaled down on both axes and rotated.
        let canvas = item.canvas;
        if (item.matrix.a !== 1) {
            const tmpCanvas = createCanvas(Math.round(item.size.width * item.matrix.a), canvas.height);
            const context = tmpCanvas.getContext('2d');
            context.drawImage(canvas, 0, 0, tmpCanvas.width, tmpCanvas.height);
            canvas = tmpCanvas;
        }
        if (item.matrix.d !== 1) {
            const tmpCanvas = createCanvas(canvas.width, Math.round(item.size.height * item.matrix.d));
            const context = tmpCanvas.getContext('2d');
            context.drawImage(canvas, 0, 0, tmpCanvas.width, tmpCanvas.height);
            canvas = context.canvas;
        }
        getRaster().drawImage(canvas, item.bounds.topLeft);
        item.remove();
    }
    commitArbitraryTransformation (item) {
        // Create a canvas to perform masking
        const tmpCanvas = createCanvas();
        const context = tmpCanvas.getContext('2d');
        // Draw mask
        const rect = new paper.Shape.Rectangle(new paper.Point(), item.size);
        rect.matrix = item.matrix;
        drawRect(rect, context);
        context.globalCompositeOperation = 'source-in';

        // Draw image onto mask
        const m = item.matrix;
        context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
        context.transform(1, 0, 0, 1, -item.data.expanded.canvas.width / 2, -item.data.expanded.canvas.height / 2);
        context.drawImage(item.data.expanded.canvas, 0, 0);

        // Draw temp canvas onto raster layer
        getRaster().canvas.getContext('2d').drawImage(tmpCanvas, 0, 0);
        item.remove();
    }
    deactivateTool () {
        this.commitSelection();
        this.boundingBoxTool.removeBoundsPath();
        this.boundingBoxTool = null;
        this.selectionBoxTool = null;
    }
}

export default SelectTool;
