import paper from '@scratch/paper';
import {clearRaster, getRaster, hideGuideLayers, showGuideLayers} from '../helper/layer';
import {inlineSvgFonts} from 'scratch-svg-renderer';

const forEachLinePoint = function (point1, point2, callback) {
    // Bresenham line algorithm
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
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
        callback(x1, y1);
    }
};

/**
 * @param {!object} options drawing options
 * @param {!number} options.centerX center of ellipse, x
 * @param {!number} options.centerY center of ellipse, y
 * @param {!number} options.radiusX major radius of ellipse
 * @param {!number} options.radiusY minor radius of ellipse
 * @param {!number} options.shearSlope slope of the sheared x axis
 * @param {?boolean} options.isFilled true if isFilled
 * @param {!CanvasRenderingContext2D} context for drawing
 */
const drawShearedEllipse = function (options, context) {
    const centerX = ~~options.centerX;
    const centerY = ~~options.centerY;
    const radiusX = ~~options.radiusX;
    const radiusY = ~~options.radiusY;
    const shearSlope = options.shearSlope;
    const isFilled = options.isFilled;
    if (shearSlope === Infinity || radiusX === 0 || radiusY === 0) {
        return;
    }

    // Bresenham ellipse algorithm
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
        if (isFilled) {
            context.fillRect(centerX + x - 1, centerY - y - Math.round(x * shearSlope), 1, y << 1);
            context.fillRect(centerX - x, centerY - y + Math.round(x * shearSlope), 1, y << 1);
        } else {
            // TODO connect these to the prev segment and add thickness
            context.fillRect(centerX + x - 1, centerY + y - Math.round(x * shearSlope), 1, 1);
            context.fillRect(centerX + x - 1, centerY - y - Math.round(x * shearSlope), 1, 1);
            context.fillRect(centerX - x, centerY + y + Math.round(x * shearSlope), 1, 1);
            context.fillRect(centerX - x, centerY - y + Math.round(x * shearSlope), 1, 1);
        }
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
        if (isFilled) {
            //context.fillRect(centerX + x - 1, centerY - y, 1, y << 1);
            //context.fillRect(centerX - x, centerY - y, 1, y << 1);
            context.fillRect(centerX + x - 1, centerY - y - Math.round(x * shearSlope), 1, y << 1);
            context.fillRect(centerX - x, centerY - y + Math.round(x * shearSlope), 1, y << 1);
        } else {
            context.fillRect(centerX + x - 1, centerY + y - Math.round(x * shearSlope), 1, 1);
            context.fillRect(centerX + x - 1, centerY - y - Math.round(x * shearSlope), 1, 1);
            context.fillRect(centerX - x, centerY + y + Math.round(x * shearSlope), 1, 1);
            context.fillRect(centerX - x, centerY - y + Math.round(x * shearSlope), 1, 1);
        }
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
};

/**
 * @param {!object} options drawing options
 * @param {!number} options.centerX center of ellipse, x
 * @param {!number} options.centerY center of ellipse, y
 * @param {!number} options.radiusX major radius of ellipse
 * @param {!number} options.radiusY minor radius of ellipse
 * @param {!number} options.rotation of ellipse, radians
 * @param {?boolean} options.isFilled true if isFilled
 * @param {!CanvasRenderingContext2D} context for drawing
 */
const drawRotatedEllipse = function (options, context) {
    const centerX = ~~options.centerX;
    const centerY = ~~options.centerY;
    const radiusX = ~~options.radiusX;
    const radiusY = ~~options.radiusY;
    const rotation = options.rotation;
    const isFilled = options.isFilled;
    if (radiusX === radiusY) {
        drawShearedEllipse({centerX, centerY, radiusX, radiusY, shearSlope: 0, isFilled}, context);
    }
    const theta = Math.atan2(radiusY * -Math.tan(rotation), radiusX);
    const shearDx = (radiusX * Math.cos(theta) * Math.cos(rotation)) - (radiusY * Math.sin(theta) * Math.sin(rotation));
    const shearDy = (radiusX * Math.cos(theta) * Math.sin(rotation)) + (radiusY * Math.sin(theta) * Math.cos(rotation));
    const shearSlope = shearDy / shearDx;
    const shearRadiusX = Math.abs(shearDx);
    const shearRadiusY = radiusX * radiusY / shearRadiusX;
    drawShearedEllipse({centerX, centerY, radiusX: shearRadiusX, radiusY: shearRadiusY, shearSlope, isFilled}, context);
};

const fillEllipse = function (centerX, centerY, radiusX, radiusY, context) {
    drawShearedEllipse({centerX, centerY, radiusX, radiusY, shearSlope: 0, isFilled: true}, context);
};

/**
 * @param {!number} size The diameter of the brush
 * @param {!string} color The css color of the brush
 * @return {HTMLCanvasElement} a canvas with the brush mark printed on it
 */
const getBrushMark = function (size, color) {
    size = ~~size;
    const canvas = document.createElement('canvas');
    const roundedUpRadius = Math.ceil(size / 2);
    canvas.width = roundedUpRadius * 2;
    canvas.height = roundedUpRadius * 2;
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    context.fillStyle = color;
    // Small squares for pixel artists
    if (size <= 5) {
        if (size % 2) {
            context.fillRect(1, 1, size, size);
        } else {
            context.fillRect(0, 0, size, size);
        }
    } else {
        const roundedDownRadius = ~~(size / 2);
        fillEllipse(roundedDownRadius, roundedDownRadius, roundedDownRadius, roundedDownRadius, context);
    }
    return canvas;
};

const rowBlank_ = function (imageData, width, y) {
    for (let x = 0; x < width; ++x) {
        if (imageData.data[(y * width << 2) + (x << 2) + 3] !== 0) return false;
    }
    return true;
};

const columnBlank_ = function (imageData, width, x, top, bottom) {
    for (let y = top; y < bottom; ++y) {
        if (imageData.data[(y * width << 2) + (x << 2) + 3] !== 0) return false;
    }
    return true;
};

// Adapted from Tim Down's https://gist.github.com/timdown/021d9c8f2aabc7092df564996f5afbbf
// Get bounds, trimming transparent pixels from edges.
const getHitBounds = function (raster) {
    const width = raster.width;
    const imageData = raster.getImageData(raster.bounds);
    let top = 0;
    let bottom = imageData.height;
    let left = 0;
    let right = imageData.width;

    while (top < bottom && rowBlank_(imageData, width, top)) ++top;
    while (bottom - 1 > top && rowBlank_(imageData, width, bottom - 1)) --bottom;
    while (left < right && columnBlank_(imageData, width, left, top, bottom)) ++left;
    while (right - 1 > left && columnBlank_(imageData, width, right - 1, top, bottom)) --right;

    return new paper.Rectangle(left, top, right - left, bottom - top);
};

const _trim = function (raster) {
    return raster.getSubRaster(getHitBounds(raster));
};

const convertToBitmap = function (clearSelectedItems, onUpdateImage) {
    // @todo if the active layer contains only rasters, drawing them directly to the raster layer
    // would be more efficient.

    clearSelectedItems();

    // Export svg
    const guideLayers = hideGuideLayers(true /* includeRaster */);
    const bounds = paper.project.activeLayer.bounds;
    const svg = paper.project.exportSVG({
        bounds: 'content',
        matrix: new paper.Matrix().translate(-bounds.x, -bounds.y)
    });
    showGuideLayers(guideLayers);

    // Get rid of anti-aliasing
    // @todo get crisp text?
    svg.setAttribute('shape-rendering', 'crispEdges');
    inlineSvgFonts(svg);
    const svgString = (new XMLSerializer()).serializeToString(svg);

    // Put anti-aliased SVG into image, and dump image back into canvas
    const img = new Image();
    img.onload = () => {
        getRaster().drawImage(
            img,
            new paper.Point(Math.floor(bounds.topLeft.x), Math.floor(bounds.topLeft.y)));

        paper.project.activeLayer.removeChildren();
        onUpdateImage();
    };
    img.onerror = () => {
        // Fallback if browser does not support SVG data URIs in images.
        // The problem with rasterize is that it will anti-alias.
        const raster = paper.project.activeLayer.rasterize(72, false /* insert */);
        raster.onLoad = () => {
            getRaster().drawImage(raster.canvas, raster.bounds.topLeft);
            paper.project.activeLayer.removeChildren();
            onUpdateImage();
        };
    };
    // Hash tags will break image loading without being encoded first
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

const convertToVector = function (clearSelectedItems, onUpdateImage) {
    clearSelectedItems();
    const raster = _trim(getRaster());
    if (raster.width === 0 || raster.height === 0) {
        raster.remove();
    } else {
        paper.project.activeLayer.addChild(raster);
    }
    clearRaster();
    onUpdateImage();
};

export {
    convertToBitmap,
    convertToVector,
    getBrushMark,
    getHitBounds,
    fillEllipse,
    drawRotatedEllipse,
    drawShearedEllipse,
    forEachLinePoint
};
