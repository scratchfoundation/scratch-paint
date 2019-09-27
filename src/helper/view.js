import paper from '@scratch/paper';
import {CROSSHAIR_SIZE, getBackgroundGuideLayer, getDragCrosshairLayer, getRaster} from './layer';
import {getAllRootItems, getSelectedRootItems} from './selection';
import {getHitBounds} from './bitmap';

// Vectors are imported and exported at SVG_ART_BOARD size.
// Once they are imported however, both SVGs and bitmaps are on
// canvases of ART_BOARD size.
const SVG_ART_BOARD_WIDTH = 480;
const SVG_ART_BOARD_HEIGHT = 360;
const ART_BOARD_WIDTH = 480 * 2;
const ART_BOARD_HEIGHT = 360 * 2;
const CENTER = new paper.Point(ART_BOARD_WIDTH / 2, ART_BOARD_HEIGHT / 2);
const PADDING_PERCENT = 25; // Padding as a percent of the max of width/height of the sprite
const BUFFER = 50; // Number of pixels of allowance around objects at the edges of the workspace
const MIN_RATIO = .125; // Zoom in to at least 1/8 of the screen. This way you don't end up incredibly
                        // zoomed in for tiny costumes.
const ART_BOARD_BOUNDS = new paper.Rectangle(0, 0, ART_BOARD_WIDTH, ART_BOARD_HEIGHT);

let _workspaceBounds = ART_BOARD_BOUNDS;

const clampViewBounds = () => {
    const {left, right, top, bottom} = paper.project.view.bounds;
    if (left < _workspaceBounds.left) {
        paper.project.view.scrollBy(new paper.Point(_workspaceBounds.left - left, 0));
    }
    if (top < _workspaceBounds.top) {
        paper.project.view.scrollBy(new paper.Point(0, _workspaceBounds.top - top));
    }
    if (bottom > _workspaceBounds.bottom) {
        paper.project.view.scrollBy(new paper.Point(0, _workspaceBounds.bottom - bottom));
    }
    if (right > _workspaceBounds.right) {
        paper.project.view.scrollBy(new paper.Point(_workspaceBounds.right - right, 0));
    }
    setWorkspaceBounds();
};

const _resizeCrosshair = () => {
    if (getDragCrosshairLayer() && getDragCrosshairLayer().dragCrosshair) {
        getDragCrosshairLayer().dragCrosshair.scale(
            CROSSHAIR_SIZE / getDragCrosshairLayer().dragCrosshair.bounds.width / paper.view.zoom);
    }
    if (getBackgroundGuideLayer() && getBackgroundGuideLayer().dragCrosshair) {
        getBackgroundGuideLayer().dragCrosshair.scale(
            CROSSHAIR_SIZE / getBackgroundGuideLayer().dragCrosshair.bounds.width / paper.view.zoom);
    }
};

// Zoom keeping a project-space point fixed.
// This article was helpful http://matthiasberth.com/tech/stable-zoom-and-pan-in-paperjs
const zoomOnFixedPoint = (deltaZoom, fixedPoint) => {
    const view = paper.view;
    const preZoomCenter = view.center;
    const newZoom = Math.max(0.5, view.zoom + deltaZoom);
    const scaling = view.zoom / newZoom;
    const preZoomOffset = fixedPoint.subtract(preZoomCenter);
    const postZoomOffset = fixedPoint.subtract(preZoomOffset.multiply(scaling))
        .subtract(preZoomCenter);
    view.zoom = newZoom;
    view.translate(postZoomOffset.multiply(-1));

    // Cut out empty space when "jump" zooming
    const items = getAllRootItems();
    let bounds = ART_BOARD_BOUNDS.expand(BUFFER);
    for (const item of items) {
        bounds = bounds.unite(item.bounds.expand(BUFFER));
    }

    // Center in view if viewport is larger than workspace
    let hDiff = 0;
    let vDiff = 0;
    if (bounds.width < paper.view.bounds.width) {
        hDiff = paper.view.bounds.width - bounds.width;
        bounds.left -= hDiff / 2;
        bounds.width += hDiff;
    }
    if (bounds.height < paper.view.bounds.height) {
        vDiff = paper.view.bounds.height - bounds.height;
        bounds.top -= vDiff / 2;
        bounds.height += vDiff;
    }
    _workspaceBounds = bounds;

    clampViewBounds();
    _resizeCrosshair();
};

// Zoom keeping the selection center (if any) fixed.
const zoomOnSelection = deltaZoom => {
    let fixedPoint;
    const items = getSelectedRootItems();
    if (items.length > 0) {
        let rect = null;
        for (const item of items) {
            if (rect) {
                rect = rect.unite(item.bounds);
            } else {
                rect = item.bounds;
            }
        }
        fixedPoint = rect.center;
    } else {
        fixedPoint = paper.project.view.center;
    }
    zoomOnFixedPoint(deltaZoom, fixedPoint);
};

const resetZoom = () => {
    paper.project.view.zoom = .5;
    _resizeCrosshair();
    clampViewBounds();
};

const pan = (dx, dy) => {
    paper.project.view.scrollBy(new paper.Point(dx, dy));
    clampViewBounds();
};

const getWorkspaceBounds = () => {
    return _workspaceBounds;
}

const setWorkspaceBounds = () => {
    // The workspace bounds define the areas that the scroll bars can access.
    // They include at minimum the artboard, and extend to a bit beyond the
    // farthest item off tne edge in any given direction (so items can't be
    // "lost" off the edge)
    const items = getAllRootItems();
    // Include the artboard and what's visible in the viewport
    let bounds = ART_BOARD_BOUNDS.expand(BUFFER);
    bounds = bounds.unite(paper.view.bounds);

    for (const item of items) {
        bounds = bounds.unite(item.bounds.expand(BUFFER));
    }
    _workspaceBounds = bounds;
};

/* Mouse actions are clamped to action bounds */
const getActionBounds = () => {
    return paper.view.bounds.unite(ART_BOARD_BOUNDS);
};

const zoomToFit = isBitmap => {
    resetZoom();
    let bounds;
    if (isBitmap) {
        bounds = getHitBounds(getRaster());
    } else {
        bounds = paper.project.activeLayer.bounds;
    }
    if (bounds && bounds.width && bounds.height) {
        // Ratio of (sprite length plus padding on all sides) to art board length.
        let ratio = Math.max(bounds.width * (1 + (2 * PADDING_PERCENT / 100)) / ART_BOARD_WIDTH,
            bounds.height * (1 + (2 * PADDING_PERCENT / 100)) / ART_BOARD_HEIGHT);
        // Clamp ratio
        ratio = Math.max(Math.min(1, ratio), MIN_RATIO);
        if (ratio < 1) {
            paper.view.center = bounds.center;
            paper.view.zoom = paper.view.zoom / ratio;
            _resizeCrosshair();
            clampViewBounds();
        }
    }
};

export {
    ART_BOARD_HEIGHT,
    ART_BOARD_WIDTH,
    CENTER,
    SVG_ART_BOARD_WIDTH,
    SVG_ART_BOARD_HEIGHT,
    clampViewBounds,
    getActionBounds,
    pan,
    resetZoom,
    setWorkspaceBounds,
    getWorkspaceBounds,
    zoomOnSelection,
    zoomOnFixedPoint,
    zoomToFit
};
