import paper from '@scratch/paper';
import {styleShape} from '../style-path';

/**
 * Tool for drawing pencil strokes.
 */
class PencilTool extends paper.Tool {
    static get TOLERANCE () {
        return 4;
    }
    /**
     * @param {!function} onUpdateImage A callback to call when the image visibly changes
     * @param {function} clearSelectedItems Callback to clear the set of selected items in the Redux state
     */
    constructor (onUpdateImage, clearSelectedItems) {
        super();
        this.onUpdateImage = onUpdateImage;
        this.clearSelectedItems = clearSelectedItems;

        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDown = this.handleMouseDown;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseMove = this.handleMouseMove;
        this.onMouseUp = this.handleMouseUp;

        this.path = null;
        this.colorState = null;
        this.active = false;
    }
    /**
     * Should be called if the selection changes to update the bounds of the bounding box.
     * @param {Array<paper.Item>} selectedItems Array of selected items.
     */
    onSelectionChanged (selectedItems) {
        this.boundingBoxTool.onSelectionChanged(selectedItems);
    }
    setColorState (colorState) {
        this.colorState = colorState;
    }
    handleMouseDown (event) {
        if (event.event.button > 0) return; // only first mouse button
        this.active = true;

        this.path = new paper.Path();

        styleShape(this.path, this.colorState);
    }
    handleMouseDrag (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        const point = new paper.Point(event.point.x, event.point.y);
        
        this.path.add(point);
    }
    handleMouseUp (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button
        this.active = false;

        if (this.path) {
            if (this.path.length < PencilTool.TOLERANCE / paper.view.zoom) {
                // Tiny stroke drawn unintentionally?
                this.path.remove();
                this.path = null;
            } else {
                const strokePath = this.path.clone(true);

                strokePath.smooth();
                strokePath.simplify(10);

                this.path.remove();
                this.path = null;

                this.onUpdateImage();
            }
        }

    }
    deactivateTool () {
        
    }
}

export default PencilTool;
