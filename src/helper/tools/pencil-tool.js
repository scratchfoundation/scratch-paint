import paper from '@scratch/paper';
import {stylePath} from '../style-path';

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
        this.smoothing = null;
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
    setSmoothing (smoothing) {
        this.smoothing = smoothing;
    }
    handleMouseDown (event) {
        if (event.event.button > 0) return; // only first mouse button
        this.active = true;

        // Start a new path and style it
        this.path = new paper.Path({
            strokeCap: 'round',
            strokeJoin: 'round'
        });

        stylePath(this.path, this.colorState.strokeColor, this.colorState.strokeWidth);
    }
    handleMouseDrag (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        this.path.add(event.point);
    }
    handleMouseUp (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button
        this.active = false;

        if (this.path) {
            const scaledTolerance = PencilTool.TOLERANCE / paper.view.zoom;
            if (this.path.length < scaledTolerance) {
                // Tiny stroke drawn unintentionally?
                this.path.remove();
                this.path = null;
            } else {
                // Clone path, close (possibly), simplify
                const strokePath = this.path.clone(true);

                // Close the path if the first and last points are sufficiently close
                strokePath.closed = strokePath.firstSegment.point.getDistance(strokePath.lastSegment.point) <
                                    scaledTolerance;

                strokePath.simplify(this.smoothing);

                this.path.remove();
                this.path = null;

                this.onUpdateImage();
            }
        }

    }
}

export default PencilTool;
