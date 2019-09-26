import paper from '@scratch/paper';
import {getSelectedRootItems} from '../selection';
import {ART_BOARD_WIDTH, ART_BOARD_HEIGHT} from '../view';
import {getActionBounds} from '../view';

const NUDGE_MORE_MULTIPLIER = 15;

/**
 * Tool containing handlers for arrow key events for nudging the selection.
 * Note that this tool is built for selection mode, not reshape mode.
 */
class NudgeTool {
    /**
     * @param {function} boundingBoxTool to control the bounding box
     * @param {!function} onUpdateImage A callback to call when the image visibly changes
     */
    constructor (boundingBoxTool, onUpdateImage) {
        this.boundingBoxTool = boundingBoxTool;
        this.onUpdateImage = onUpdateImage;
    }
    onKeyDown (event) {
        if (event.event.target instanceof HTMLInputElement) {
            // Ignore nudge if a text input field is focused
            return;
        }

        let nudgeAmount = 1 / paper.view.zoom;
        if (event.modifiers.shift) nudgeAmount *= NUDGE_MORE_MULTIPLIER;

        const selected = getSelectedRootItems();
        if (selected.length === 0) return;
        
        // Get bounds. Don't let item bounds go out of bounds.
        let rect;
        for (const item of selected) {
            if (rect) {
                rect = rect.unite(item.bounds);
            } else {
                rect = item.bounds;
            }
        }
        const bounds = getActionBounds();

        let translation;
        if (event.key === 'up') {
            translation = new paper.Point(0, Math.max(-nudgeAmount, bounds.top - rect.bottom + 1));
        } else if (event.key === 'down') {
            translation = new paper.Point(0, Math.min(nudgeAmount, bounds.bottom - rect.top - 1));
        } else if (event.key === 'left') {
            translation = new paper.Point(Math.max(-nudgeAmount, bounds.left - rect.right + 1), 0);
        } else if (event.key === 'right') {
            translation = new paper.Point(Math.min(nudgeAmount, bounds.right - rect.left - 1), 0);
        }

        if (translation) {
            for (const item of selected) {
                item.translate(translation);
            }
            this.boundingBoxTool.setSelectionBounds();
            event.preventDefault();
        }
    }
    onKeyUp (event) {
        const selected = getSelectedRootItems();
        if (selected.length === 0) return;

        if (event.key === 'up' || event.key === 'down' || event.key === 'left' || event.key === 'right') {
            this.onUpdateImage();
        }
    }
}

export default NudgeTool;
