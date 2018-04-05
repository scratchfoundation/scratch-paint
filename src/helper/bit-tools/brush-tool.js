import paper from '@scratch/paper';
import {getRaster} from '../layer';

/**
 * Tool for drawing with the bitmap brush.
 */
class BrushTool extends paper.Tool {
    /**
     * @param {!function} onUpdateSvg A callback to call when the image visibly changes
     */
    constructor (onUpdateSvg) {
        super();
        this.onUpdateSvg = onUpdateSvg;
        
        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDown = this.handleMouseDown;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;

        this.colorState = null;
        this.active = false;
        this.lastPoint = null;
        // For performance, make sure this is an integer
        this.size = 10;
    }
    setColor (color) {
        this.color = color;
    }
    line (point1, point2, callback){
        // Bresenham line algorithm
        // Fast Math.floor
        let x1 = ~~point1.x;
        const x2 = ~~point2.x;
        let y1 = ~~point1.y;
        const y2 = ~~point2.y;
        
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = (x1 < x2) ? 1 : -1;
        const sy = (y1 < y2) ? 1 : -1;
        let err = dx - dy;
        
        callback(x1, y1);
        while (x1 !== x2 || y1 !== y2) {
            const e2 = err * 2;
            if (e2 > -dy) {
                err -= dy; x1 += sx;
            }
            if (e2 < dx) {
                err += dx; y1 += sy;
            }
            callback(x1, y1);
        }
    }
    fillEllipse (centerX, centerY, radiusX, radiusY, context) {
        // Bresenham ellipse algorithm
        centerX = ~~centerX;
        centerY = ~~centerY;
        radiusX = ~~radiusX;
        radiusY = ~~radiusY;
        const twoRadXSquared = 2 * radiusX * radiusX;
        const twoRadYSquared = 2 * radiusY * radiusY;
        let x = radiusX;
        let y = 0;
        let dx = radiusY * radiusY * (1 - (radiusX << 1));
        let dy = radiusX * radiusX;
        let error = 0;
        let stoppingX = twoRadYSquared * radiusX;
        let stoppingY = 0;
     
        while (stoppingX >= stoppingY) {
            context.fillRect(centerX - x, centerY - y, x << 1, y << 1);
            y++;
            stoppingY += twoRadXSquared;
            error += dy;
            dy += twoRadXSquared;
            if ((error << 1) + dx > 0) {
                x--;
                stoppingX -= twoRadYSquared;
                error += dx;
                dx += twoRadYSquared;
            }
        }

        x = 0;
        y = radiusY;
        dx = radiusY * radiusY;
        dy = radiusX * radiusX * (1 - (radiusY << 1));
        error = 0;
        stoppingX = 0;
        stoppingY = twoRadXSquared * radiusY;
        while (stoppingX <= stoppingY) {
            context.fillRect(centerX - x, centerY - y, x * 2, y * 2);
            x++;
            stoppingX += twoRadYSquared;
            error += dx;
            dx += twoRadYSquared;
            if ((error << 1) + dy > 0) {
                y--;
                stoppingY -= twoRadXSquared;
                error += dy;
                dy += twoRadXSquared;
            }

        }
    }
    // Draw a brush mark at the given point
    draw (x, y) {
        getRaster().drawImage(this.tmpCanvas, new paper.Point(x - ~~(this.size / 2), y - ~~(this.size / 2)));
    }
    handleMouseDown (event) {
        if (event.event.button > 0) return; // only first mouse button
        this.active = true;

        this.tmpCanvas = document.createElement('canvas');
        this.tmpCanvas.width = this.size;
        this.tmpCanvas.height = this.size;
        const context = this.tmpCanvas.getContext('2d');
        context.imageSmoothingEnabled = false;
        context.fillStyle = this.color;
        // Small squares for pixel artists
        if (this.size <= 4) {
            context.fillRect(0, 0, this.size, this.size);
        } else {
            this.fillEllipse(this.size / 2, this.size / 2, this.size / 2, this.size / 2, context);
        }

        this.draw(event.point, event.point);
        this.lastPoint = event.point;
    }
    handleMouseDrag (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseDrag(event);
            return;
        }
        this.line(this.lastPoint, event.point, this.draw.bind(this));
        this.lastPoint = event.point;
    }
    handleMouseUp (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button
        
        this.line(this.lastPoint, event.point, this.draw.bind(this));

        this.tmpCanvas = null;
        this.lastPoint = null;
        this.active = false;
    }
    deactivateTool () {
    }
}

export default BrushTool;
