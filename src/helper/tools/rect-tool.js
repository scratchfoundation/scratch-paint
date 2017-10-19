import paper from '@scratch/paper';
import Modes from '../../modes/modes';
import {styleShape} from '../style-path';
import BoundingBoxTool from '../selection-tools/bounding-box-tool';

/**
 * Tool for drawing rectangles.
 */
class RectTool extends paper.Tool {
    /**
     * @param {function} setSelectedItems Callback to set the set of selected items in the Redux state
     * @param {function} clearSelectedItems Callback to clear the set of selected items in the Redux state
     * @param {!function} onUpdateSvg A callback to call when the image visibly changes
     */
    constructor (setSelectedItems, clearSelectedItems, onUpdateSvg) {
        super();
        this.onUpdateSvg = onUpdateSvg;
        this.prevHoveredItemId = null;
        this.boundingBoxTool = new BoundingBoxTool(Modes.SELECT, setSelectedItems, clearSelectedItems, onUpdateSvg);
        
        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;

        this.downPoint = null;
        this.rect = null;
        this.colorState = null;
    }
    setColorState (colorState) {
        this.colorState = colorState;
    }
    handleMouseDrag (event) {
        if (event.event.button > 0) return;  // only first mouse button

        if (this.rect) {
            this.rect.remove();
        }
        this.rect = new paper.Path.Rectangle(event.downPoint, event.point);
        
        if (event.modifiers.shift) {
            this.rect.height = this.rect.width;
        }
        
        if (event.modifiers.alt) {
            this.rect.position = event.downPoint;
        }
        
        styleShape(this.rect, this.colorState);
    }
    handleMouseUp (event) {
        if (event.event.button > 0) return;  // only first mouse button
        
        if (this.rect) {
            this.onUpdateSvg();
            this.rect = null;
        }
    }
    deactivateTool () {
        this.downPoint = null;
        this.rect = null;
        this.colorState = null;
    }
}

export default RectTool;
