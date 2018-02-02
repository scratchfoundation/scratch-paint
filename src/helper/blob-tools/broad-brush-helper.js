// Broadbrush based on http://paperjs.org/tutorials/interaction/working-with-mouse-vectors/
import paper from '@scratch/paper';
import {styleBlob} from '../../helper/style-path';

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
        this.smoothingOverlap = 0;
        this.steps = 0;
    }

    onBroadMouseDown (event, tool, options) {
        this.smoothed = 0;
        tool.minDistance = Math.max(2, options.brushSize / 2);
        tool.maxDistance = options.brushSize;
        if (event.event.button > 0) return; // only first mouse button
        
        this.finalPath = new paper.Path();
        styleBlob(this.finalPath, options);
        this.finalPath.add(event.point);
        // this.finalPath.selected = true;
        // paper.settings.handleSize = 4;
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
        }
        step.angle += 90;
        const top = event.middlePoint.add(step);
        const bottom = event.middlePoint.subtract(step);

        if (this.steps === 2) {
            this.finalPath.removeSegment(this.finalPath.segments.length - 1);
            this.finalPath.removeSegment(0);
        }
        this.finalPath.add(top);
        this.finalPath.add(event.point.add(step));
        this.finalPath.insert(0, bottom);
        this.finalPath.insert(0, event.point.subtract(step));
        if (this.steps === 3) {
            // Flatten is necessary to prevent smooth from getting rid of the effect
            // of the handles on the first point, which makes it too pointy.
            this.finalPath.flatten(Math.min(5, options.brushSize / 5));
        }
        if (this.finalPath.segments.length > this.smoothed + (this.smoothingThreshold * 2)) {
            this.simplify(1);
            console.log('flatten');
        }
        this.lastPoint = event.point;
        this.secondLastPoint = event.lastPoint;
    }

    simplify (threshold) {
        const length = this.finalPath.segments.length;
        // this.finalPath.smooth({from: 1, to: Math.min(this.smoothingThreshold, Math.floor((length / 2) - 2))});
        // this.finalPath.smooth({from: Math.max(length - 1 - this.smoothingThreshold, Math.floor(length / 2) + 2), to: length - 2});
        // this.smoothed = Math.max(2, length - (this.smoothingOverlap * 2));
        // if (Math.random() > .9) {
            const newPoints = Math.floor((length - this.smoothed) / 2) + this.smoothingOverlap;
            const firstCutoff =  Math.min(newPoints + 1, Math.floor((length / 2) - 1));
            const lastCutoff = Math.max(length - 1 - newPoints, Math.floor(length / 2) + 2);
            const tempPath1 = new paper.Path(this.finalPath.segments.slice(1, firstCutoff));
            const tempPathMid = new paper.Path(this.finalPath.segments.slice(firstCutoff, lastCutoff));
            const tempPath2 = new paper.Path(this.finalPath.segments.slice(lastCutoff, length - 1));
            console.log(newPoints);
            console.log(tempPathMid.segments.length);
            tempPath1.simplify(threshold);
            tempPath2.simplify(threshold);
            this.finalPath.removeSegments(1, this.finalPath.segments.length - 1);
            this.finalPath.insertSegments(1, tempPath1.segments.concat(tempPathMid.segments).concat(tempPath2.segments));
            tempPath1.remove();
            tempPath2.remove();
            tempPathMid.remove();
        // }
        this.smoothed = Math.max(2, this.finalPath.segments.length - ((1 + this.smoothingOverlap) * 2));
    }

    onBroadMouseUp (event, tool, options) {
        debugger;
        console.log(this.lastPoint);
        console.log(event.point);
        console.log(this.secondLastPoint);
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
        // If the mouse up is at the same point as the mouse drag event then we need
        // the second to last point to get the right direction vector for the end cap
        if (!event.point.equals(this.lastPoint)) {
            const step = (event.point.subtract(this.lastPoint)).normalize(options.brushSize / 2);
            step.angle += 90;

            const top = event.point.add(step);
            const bottom = event.point.subtract(step);
            this.finalPath.add(top);
            this.finalPath.insert(0, bottom);
        }

        // Simplify before adding end cap so cap doesn't get warped
        this.simplify(1);

        // Add end cap
        const circ = new paper.Path.Circle(event.point, options.brushSize / 2);
        circ.fillColor = options.fillColor;

        // Resolve self-crossings
        const newPath =
            this.finalPath
                .resolveCrossings()
                .reorient(true /* nonZero */, true /* clockwise */)
                .reduce({simplify: true});
        newPath.copyAttributes(this.finalPath);
        newPath.fillColor = this.finalPath.fillColor;
        this.finalPath = newPath;
        this.steps = 0;
        return this.finalPath;
    }
}

export default BroadBrushHelper;
