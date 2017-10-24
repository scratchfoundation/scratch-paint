import paper from '@scratch/paper';

const getGuideLayer = function () {
    for (let i = 0; i < paper.project.layers.length; i++) {
        const layer = paper.project.layers[i];
        if (layer.data && layer.data.isGuideLayer) {
            return layer;
        }
    }

    // Create if it doesn't exist
    const guideLayer = new paper.Layer();
    guideLayer.data.isGuideLayer = true;
    guideLayer.bringToFront();
    return guideLayer;
};

const getBackgroundGuideLayer = function () {
    for (let i = 0; i < paper.project.layers.length; i++) {
        const layer = paper.project.layers[i];
        if (layer.data && layer.data.isBackgroundGuideLayer) {
            return layer;
        }
    }
};

const _makePaintingLayer = function () {
    const paintingLayer = new paper.Layer();
    paintingLayer.data.isPaintingLayer = true;
    return paintingLayer;
};

const _makeBackgroundGuideLayer = function () {
    const BLOCK_WIDTH = 4;
    const guideLayer = new paper.Layer();
    guideLayer.locked = true;
    for (let i = 0; i < 500 / BLOCK_WIDTH; i += 2) {
        for (let j = 0; j < 400 / BLOCK_WIDTH; j++) {
            const rect = new paper.Shape.Rectangle(
                new paper.Point((i + (j % 2)) * BLOCK_WIDTH, j * BLOCK_WIDTH),
                new paper.Point((i + (j % 2) + 1) * BLOCK_WIDTH, (j + 1) * BLOCK_WIDTH)
            );
            rect.fillColor = '#E5E5E5';
            rect.guide = true;
            rect.locked = true;
        }
    }

    const vLine = new paper.Path.Line(new paper.Point(0, -7), new paper.Point(0, 7));
    vLine.strokeWidth = 2;
    vLine.strokeColor = '#ccc';
    vLine.position = paper.view.center;
    vLine.guide = true;
    vLine.locked = true;

    const hLine = new paper.Path.Line(new paper.Point(-7, 0), new paper.Point(7, 0));
    hLine.strokeWidth = 2;
    hLine.strokeColor = '#ccc';
    hLine.position = paper.view.center;
    hLine.guide = true;
    hLine.locked = true;

    const circle = new paper.Shape.Circle(new paper.Point(0, 0), 5);
    circle.strokeWidth = 2;
    circle.strokeColor = '#ccc';
    circle.position = paper.view.center;
    circle.guide = true;
    circle.locked = true;

    guideLayer.data.isBackgroundGuideLayer = true;
    guideLayer.sendToBack();
    return guideLayer;
};

const setupLayers = function () {
    _makeBackgroundGuideLayer();
    _makePaintingLayer().activate();
};

export {
    getGuideLayer,
    getBackgroundGuideLayer,
    setupLayers
};
