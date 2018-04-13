import paper from '@scratch/paper';
import {getRaster, getBackgroundGuideLayer} from '../layer';

const LOUPE_RADIUS = 20;
const ZOOM_SCALE = 3;

class EyeDropperTool extends paper.Tool {
    constructor (canvas, width, height, pixelRatio, zoom, offsetX, offsetY, isBitmap) {
        super();

        const layer = isBitmap ? getRaster().layer : paper.project.activeLayer;
        const contentRaster3x = layer.rasterize(
            paper.view.getResolution() * ZOOM_SCALE /* resolution */, false /* insert */);
        const contentRaster = layer.rasterize(
            paper.view.getResolution() /* resolution */, false /* insert */);
        const backgroundRaster3x = getBackgroundGuideLayer().rasterize(
            paper.view.getResolution() * ZOOM_SCALE /* resolution */, false /* insert */);
        
        this.bufferCanvas = document.createElement('canvas');
        this.bufferCanvas.width = canvas.width * ZOOM_SCALE;
        this.bufferCanvas.height = canvas.height * ZOOM_SCALE;
        const bufferRaster = new paper.Raster(this.bufferCanvas);
        
        this.colorCanvas = document.createElement('canvas');
        this.colorCanvas.width = canvas.width;
        this.colorCanvas.height = canvas.height;
        const colorRaster = new paper.Raster(this.colorCanvas);

        contentRaster.onLoad = () => {
            colorRaster.drawImage(contentRaster.canvas, contentRaster.bounds.topLeft);
            colorRaster.remove();
        };
        backgroundRaster3x.onLoad = () => {
            bufferRaster.drawImage(backgroundRaster3x.canvas, backgroundRaster3x.bounds.topLeft.multiply(ZOOM_SCALE));
            contentRaster3x.onLoad = () => {
                bufferRaster.drawImage(contentRaster3x.canvas, contentRaster3x.bounds.topLeft.multiply(ZOOM_SCALE));
                bufferRaster.remove();
                bufferRaster.onLoad = () => {
                    this.bufferLoaded = true;
                };
            };
            if (contentRaster3x.loaded) contentRaster3x.onLoad();
        };

        this.onMouseDown = this.handleMouseDown;
        this.onMouseMove = this.handleMouseMove;

        this.canvas = canvas;
        this.pixelRatio = pixelRatio;
        this.zoom = zoom;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.width = width * this.zoom * this.pixelRatio;
        this.height = height * this.zoom * this.pixelRatio;
        this.rect = canvas.getBoundingClientRect();
        this.colorString = '';
        this.pickX = -1;
        this.pickY = -1;
        this.hideLoupe = true;
    }
    handleMouseMove (event) {
        // Set the pickX/Y for the color picker loop to pick up
        this.pickX = (event.point.x - this.offsetX) * this.zoom * this.pixelRatio;
        this.pickY = (event.point.y - this.offsetY) * this.zoom * this.pixelRatio;

        // check if the x/y are outside of the canvas
        this.hideLoupe = this.pickX > this.width ||
            this.pickX < 0 ||
            this.pickY > this.height ||
            this.pickY < 0;
    }
    handleMouseDown () {
        if (!this.hideLoupe) {
            const colorInfo = this.getColorInfo(this.pickX, this.pickY, this.hideLoupe);
            if (!colorInfo) return;
            const r = colorInfo.color[0];
            const g = colorInfo.color[1];
            const b = colorInfo.color[2];

            // from https://github.com/LLK/scratch-gui/blob/77e54a80a31b6cd4684d4b2a70f1aeec671f229e/src/containers/stage.jsx#L218-L222
            // formats the color info from the canvas into hex for parsing by the color picker
            const componentToString = c => {
                const hex = c.toString(16);
                return hex.length === 1 ? `0${hex}` : hex;
            };
            this.colorString = `#${componentToString(r)}${componentToString(g)}${componentToString(b)}`;
        }
    }
    getColorInfo (x, y, hideLoupe) {
        if (!this.bufferLoaded) return null;
        const colorContext = this.colorCanvas.getContext('2d');
        const loopContext = this.bufferCanvas.getContext('2d');
        const colors = colorContext.getImageData(x, y, 1, 1);
        return {
            x: x,
            y: y,
            color: colors.data,
            data: loopContext.getImageData(
                (x * ZOOM_SCALE) - (LOUPE_RADIUS * ZOOM_SCALE),
                (y * ZOOM_SCALE) - (LOUPE_RADIUS * ZOOM_SCALE),
                LOUPE_RADIUS * 2 * ZOOM_SCALE,
                LOUPE_RADIUS * 2 * ZOOM_SCALE
            ).data,
            hideLoupe: hideLoupe
        };
    }
}

export {
    EyeDropperTool as default,
    LOUPE_RADIUS,
    ZOOM_SCALE
};
