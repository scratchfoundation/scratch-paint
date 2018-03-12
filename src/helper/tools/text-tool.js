import paper from '@scratch/paper';
import Modes from '../../lib/modes';
import {styleShape} from '../style-path';
import {clearSelection} from '../selection';
import BoundingBoxTool from '../selection-tools/bounding-box-tool';
import NudgeTool from '../selection-tools/nudge-tool';

/**
 * Tool for adding text. Text elements have limited editability; they can't be reshaped,
 * drawn on or erased. This way they can preserve their ability to have the text edited.
 */
class TextTool extends paper.Tool {
    static get TOLERANCE () {
        return 6;
    }
    /**
     * @param {function} setSelectedItems Callback to set the set of selected items in the Redux state
     * @param {function} clearSelectedItems Callback to clear the set of selected items in the Redux state
     * @param {!function} onUpdateSvg A callback to call when the image visibly changes
     */
    constructor (setSelectedItems, clearSelectedItems, onUpdateSvg) {
        super();
        this.setSelectedItems = setSelectedItems;
        this.clearSelectedItems = clearSelectedItems;
        this.onUpdateSvg = onUpdateSvg;
        this.boundingBoxTool = new BoundingBoxTool(Modes.TEXT, setSelectedItems, clearSelectedItems, onUpdateSvg);
        this.nudgeTool = new NudgeTool(this.boundingBoxTool, onUpdateSvg);
        
        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDown = this.handleMouseDown;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;
        this.onKeyUp = this.handleKeyUp;
        this.onKeyDown = this.handleKeyDown;

        this.textBox = null;
        this.colorState = null;
        this.isBoundingBoxMode = null;
        this.active = false;
    }
    getHitOptions () {
        return {
            segments: true,
            stroke: true,
            curves: true,
            fill: true,
            guide: false,
            match: hitResult =>
                (hitResult.item.data && hitResult.item.data.isHelperItem) ||
                hitResult.item.selected, // Allow hits on bounding box and selected only
            tolerance: TextTool.TOLERANCE / paper.view.zoom
        };
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

        if (this.textBox && this.textBox.content.trim() === '') {
            this.textBox.remove();
            this.textBox = null;
        }
        
        if (this.boundingBoxTool.onMouseDown(event, false /* clone */, false /* multiselect */, this.getHitOptions())) {
            this.isBoundingBoxMode = true;
        } else {
            this.isBoundingBoxMode = false;
            clearSelection(this.clearSelectedItems);
            this.textBox = new paper.PointText({
                point: event.point,
                content: 'لوحة المفاتKeyboardيح العربية',
                font: 'Times',
                fontSize: 30
            });
            styleShape(this.textBox, this.colorState);
        }
    }
    handleMouseDrag (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseDrag(event);
            return;
        }

        // TODO selection
        
    }
    handleMouseUp (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button
        
        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseUp(event);
            this.isBoundingBoxMode = null;
            return;
        }

        // TODO
        this.active = false;
    }
    handleKeyUp (event) {
        if (this.isBoundingBoxMode) {
            this.nudgeTool.onKeyUp(event);
        }
    }
    handleKeyDown (event) {
        if (this.isBoundingBoxMode) {
            this.nudgeTool.onKeyUp(event);
        } else {
            if ((event.key === 'delete' || event.key === 'backspace') && this.textBox.content.length) {
                this.textBox.content = this.textBox.content.slice(0, this.textBox.content.length - 1);
            } else if (!(event.modifiers.alt || event.modifiers.comand || event.modifiers.control ||
                    event.modifiers.meta || event.modifiers.option)) {
                this.textBox.content = this.textBox.content + event.character;
            }
        }
    }
    deactivateTool () {
        this.boundingBoxTool.removeBoundsPath();
        if (this.textBox && this.textBox.content.trim() === '') {
            this.textBox.remove();
            this.textBox = null;
        }
    }
}

export default TextTool;
