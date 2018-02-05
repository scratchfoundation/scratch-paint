// Broadbrush based on http://paperjs.org/tutorials/interaction/working-with-mouse-vectors/
import paper from '@scratch/paper';
import {styleBlob} from '../../helper/style-path';
import OffsetUtils from './offset';

/**
 * Broad brush functions to add as listeners on the mouse. Call them when the corresponding mouse event happens
 * to get the broad brush behavior.
 *
 * Broad brush draws strokes by drawing points equidistant from the mouse event, perpendicular to the
 * direction of motion. Shortcomings are that this path can cross itself, and 180 degree turns result
 * in a flat edge.
 *
 * @param {!Tool} tool paper.js mouse object
 */
class BroadBrushHelper {
    constructor () {
        this.lastVec = null;
        this.lastPoint = null;
        this.secondLastPoint = null;
        this.finalPath = null;
        this.smoothed = 0;
        this.smoothingThreshold = 20;
        this.smoothingOverlap = 1;
        this.steps = 0;
        this.mousePath = null;
    }

    onBroadMouseDown (event, tool, options) {
        this.smoothed = 0;
        tool.minDistance = Math.max(2, options.brushSize / 2);
        tool.maxDistance = options.brushSize;
        if (event.event.button > 0) return; // only first mouse button
        
        this.finalPath = new paper.Path();
        this.mousePath = new paper.Path({insert: false});
        styleBlob(this.finalPath, options);
        this.finalPath.add(event.point);
        this.mousePath.add(event.point);
        this.lastPoint = this.secondLastPoint = event.point;
    }
    
    onBroadMouseDrag (event, tool, options) {
        this.steps++;
        const step = (event.delta).normalize(options.brushSize / 2);
        if (this.lastVec) {
            const angle = this.lastVec.getDirectedAngle(step);
            if (Math.abs(angle) > 126) {
                const circ = new paper.Path.Circle(this.lastPoint, options.brushSize / 2);
                circ.fillColor = options.fillColor;
            }
        }
        this.lastVec = step.clone();

        // Move the first point out away from the drag so that the end of the path is rounded
        if (this.finalPath.segments && this.steps === 1) {
            const removedPoint = this.finalPath.removeSegment(0).point;
            // Add handles to round the end caps
            const handleVec = step.clone();
            handleVec.length = options.brushSize / 2;
            handleVec.angle += 90;
            this.finalPath.add(new paper.Segment(removedPoint.subtract(step), -handleVec, handleVec));
            // TODO merge here
        }
        step.angle += 90;
        const top = event.middlePoint.add(step);
        const bottom = event.middlePoint.subtract(step);

        if (this.steps === 2) {
            this.finalPath.removeSegment(this.finalPath.segments.length - 1);
            this.finalPath.removeSegment(0);
        }
        this.mousePath.add(event.point);
        this.finalPath.add(top);
        this.finalPath.add(event.point.add(step));
        this.finalPath.insert(0, bottom);
        this.finalPath.insert(0, event.point.subtract(step));
        if (this.steps === 3) {
            // Flatten is necessary to prevent smooth from getting rid of the effect
            // of the handles on the first point, which makes it too pointy.
            this.finalPath.flatten(Math.min(5, options.brushSize / 5));
        }
        // Amortized smoothing
        if (this.finalPath.segments.length > this.smoothed + (this.smoothingThreshold * 2)) {
            this.smooth();
        }
        this.secondLastPoint = event.lastPoint;
        this.lastPoint = event.point;
    }

    smooth () {
        if (this.finalPath.segments.length > this.smoothed + (this.smoothingThreshold * 2)) {
            const length = this.finalPath.segments.length;
            this.finalPath.smooth({from: 1, to: Math.min(this.smoothingThreshold, Math.floor((length / 2) - 2))});
            this.finalPath.smooth({from: Math.max(length - 1 - this.smoothingThreshold, Math.floor(length / 2) + 2), to: length - 2});
            this.smoothed = Math.max(2, length - (this.smoothingOverlap * 2));
        }
    }

    onBroadMouseUp (event, tool, options) {
        // If there was only a single click, draw a circle.
        if (this.steps === 0) {
            this.finalPath.remove();
            this.finalPath = new paper.Path.Circle({
                center: event.point,
                radius: options.brushSize / 2
            });
            styleBlob(this.finalPath, options);
            return this.finalPath;
        }

        if (!event.point.equals(this.lastPoint)) {
            this.mousePath.add(event.point);
        }
        this.mousePath.simplify();
        this.steps = 0;
        this.generatePath(this.mousePath, options);
        return this.finalPath;

    }
    generatePath (path, options) {
        path.strokeCap = 'round';
        const offset = options.brushSize / 2;
        const outerPath = OffsetUtils.offsetPath(path, offset, true);
        const innerPath = OffsetUtils.offsetPath(path, -offset, true);
        let res = OffsetUtils.joinOffsets(outerPath, innerPath, path, offset);
        res.remove();
        res = res.unite();
        res.insertBelow(this.finalPath);
        styleBlob(res, options);
        this.finalPath.remove();
        this.finalPath = res;
    }
}

export default BroadBrushHelper;
