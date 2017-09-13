import paper from 'paper';

class RotateTool {
    constructor () {
        this.rotItems = [];
        this.rotGroupPivot = null;
        this.prevRot = [];
    }

    /**
     * @param {!paper.HitResult} hitResult Data about the location of the mouse click
     * @param {!object} boundsPath Where the boundaries of the hit item are
     * @param {!Array.<paper.Item>} selectedItems Set of selected paper.Items
     */
    onMouseDown (hitResult, boundsPath, selectedItems) {
        this.rotGroupPivot = boundsPath.bounds.center;
        for (const item of selectedItems) {
            // Rotate only root items; all nested items shouldn't get rotated again.
            if (item.parent instanceof paper.Layer) {
                this.rotItems.push(item);
            }
        }
        
        for (let i = 0; i < this.rotItems.length; i++) {
            this.prevRot[i] = 90;
        }
    }
    onMouseDrag (event) {
        let rotAngle = (event.point.subtract(this.rotGroupPivot)).angle;
        
        for (let i = 0; i < this.rotItems.length; i++) {
            const item = this.rotItems[i];
            
            if (!item.data.origRot) {
                item.data.origRot = item.rotation;
            }
            
            if (event.modifiers.shift) {
                rotAngle = Math.round(rotAngle / 45) * 45;
                item.applyMatrix = false;
                item.pivot = this.rotGroupPivot;
                item.rotation = rotAngle;
            } else {
                item.rotate(rotAngle - this.prevRot[i], this.rotGroupPivot);
            }
            this.prevRot[i] = rotAngle;
        }
    }
    onMouseUp (event) {
        if (event.event.button > 0) return; // only first mouse button
        for (const item of this.rotItems) {
            item.applyMatrix = true;
        }
        
        this.rotItems.length = 0;
        this.rotGroupPivot = null;
        this.prevRot = [];

        // @todo add back undo
        // pg.undo.snapshot('rotateSelection');
    }
}

export default RotateTool;
