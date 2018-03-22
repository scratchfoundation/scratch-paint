import paper from '@scratch/paper';
import {styleBlob} from '../../helper/style-path';
import OffsetUtils from './offset';

/**
 * Draw a path, then expand when finished. Try to smooth the path a lot.
 *
 * @param {!Tool} tool paper.js mouse object
 */
class PathExpandBrushHelper {
    constructor () {
        // The path of the brush stroke we are building
        this.mousePath = null;
        // Number of points of finalPath that have already been processed
        this.smoothed = 0;
        // Number of steps to wait before performing another amortized smooth
        this.smoothingThreshold = 20;
    }

    onMouseDown (event, tool, options) {
        if (event.event.button > 0) return; // only first mouse button

        this.smoothed = 0;
        tool.minDistance = Math.min(5, Math.max(2 / paper.view.zoom, options.brushSize / 2));
        tool.maxDistance = options.brushSize;
        
        this.mousePath = new paper.Path();
        this.mousePath.strokeCap = 'round';
        this.mousePath.strokeColor = options.fillColor;
        this.mousePath.strokeWidth = options.brushSize;
        this.mousePath.add(event.point);
    }
    
    onMouseDrag (event) {
        this.mousePath.add(event.point);
        if (this.mousePath.segments.length > this.smoothed + this.smoothingThreshold) {
            this.smooth();
        }
    }

    smooth () {
        this.mousePath.smooth({
            from: this.smoothed,
            to: this.mousePath.segments.length
        });

        // Update how many points have been smoothed so far so that we don't redo work next time
        this.smoothed = this.mousePath.segments.length;
    }

    onMouseUp (event, tool, options) {
        // If there was only a single click, draw a circle.
        if (this.steps === 0) {
            const finalPath = new paper.Path.Circle({
                center: event.point,
                radius: options.brushSize / 2
            });
            styleBlob(finalPath, options);
            return finalPath;
        }

        if (!event.point.equals(this.mousePath.lastSegment.point)) {
            this.mousePath.add(event.point);
        }
        this.mousePath.simplify(50 / paper.view.zoom);
        const finalPath = this.generatePath(this.mousePath, options);
        finalPath.insertBelow(this.mousePath);
        this.mousePath.remove();
        this.mousePath = null;
        return finalPath;

    }
    generatePath (path, options) {
        path.strokeCap = 'round';
        const offset = options.brushSize / 2;
        const outerPath = OffsetUtils.offsetPath(path, offset, true);
        const innerPath = OffsetUtils.offsetPath(path, -offset, true);
        let res = OffsetUtils.joinOffsets(outerPath, innerPath, path, offset);

        // Resolve self-crossings
        const newPath = res
                .resolveCrossings()
                .reorient(true /* nonZero */, true /* clockwise */)
                .reduce({simplify: true});
        if (newPath !== res) {
            res.remove();
            res = newPath;
        }
        styleBlob(res, options);
        return res;
    }
}

export default PathExpandBrushHelper;
