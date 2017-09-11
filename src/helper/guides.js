import paper from 'paper';
import {getGuideLayer} from './layer';
import {removePaperItemsByTags, removePaperItemsByDataTags} from './helper';

const GUIDE_BLUE = '#009dec';
const GUIDE_GREY = '#aaaaaa';

const setDefaultGuideStyle = function (item) {
    item.strokeWidth = 1 / paper.view.zoom;
    item.opacity = 1;
    item.blendMode = 'normal';
    item.guide = true;
};

const hoverItem = function (hitResult) {
    const segments = hitResult.item.segments;
    const clone = new paper.Path(segments);
    setDefaultGuideStyle(clone);
    if (hitResult.item.closed) {
        clone.closed = true;
    }
    clone.parent = getGuideLayer();
    clone.strokeColor = GUIDE_BLUE;
    clone.fillColor = null;
    clone.data.isHelperItem = true;
    clone.bringToFront();

    return clone;
};

const hoverBounds = function (item) {
    const rect = new paper.Path.Rectangle(item.internalBounds);
    rect.matrix = item.matrix;
    setDefaultGuideStyle(rect);
    rect.parent = getGuideLayer();
    rect.strokeColor = GUIDE_BLUE;
    rect.fillColor = null;
    rect.data.isHelperItem = true;
    rect.bringToFront();

    return rect;
};

const rectSelect = function (event, color) {
    const half = new paper.Point(0.5 / paper.view.zoom, 0.5 / paper.view.zoom);
    const start = event.downPoint.add(half);
    const end = event.point.add(half);
    const rect = new paper.Path.Rectangle(start, end);
    const zoom = 1.0 / paper.view.zoom;
    setDefaultGuideStyle(rect);
    if (!color) color = GUIDE_GREY;
    rect.parent = getGuideLayer();
    rect.strokeColor = color;
    rect.data.isRectSelect = true;
    rect.data.isHelperItem = true;
    rect.dashArray = [3.0 * zoom, 3.0 * zoom];
    return rect;
};

const line = function (from, to, color) {
    const theLine = new paper.Path.Line(from, to);
    const zoom = 1 / paper.view.zoom;
    setDefaultGuideStyle(theLine);
    if (!color) color = GUIDE_GREY;
    theLine.parent = getGuideLayer();
    theLine.strokeColor = color;
    theLine.strokeColor = color;
    theLine.dashArray = [5 * zoom, 5 * zoom];
    theLine.data.isHelperItem = true;
    return theLine;
};

const crossPivot = function (center, color) {
    const zoom = 1 / paper.view.zoom;
    const star = new paper.Path.Star(center, 4, 4 * zoom, 0.5 * zoom);
    setDefaultGuideStyle(star);
    if (!color) color = GUIDE_BLUE;
    star.parent = getGuideLayer();
    star.fillColor = color;
    star.strokeColor = color;
    star.strokeWidth = 0.5 * zoom;
    star.data.isHelperItem = true;
    star.rotate(45);

    return star;
};

const rotPivot = function (center, color) {
    const zoom = 1 / paper.view.zoom;
    const path = new paper.Path.Circle(center, 3 * zoom);
    setDefaultGuideStyle(path);
    if (!color) color = GUIDE_BLUE;
    path.parent = getGuideLayer();
    path.fillColor = color;
    path.data.isHelperItem = true;

    return path;
};

const label = function (pos, content, color) {
    const text = new paper.PointText(pos);
    if (!color) color = GUIDE_GREY;
    text.parent = getGuideLayer();
    text.fillColor = color;
    text.content = content;
};

const getGuideColor = function (colorName) {
    if (colorName === 'blue') {
        return GUIDE_BLUE;
    } else if (colorName === 'grey') {
        return GUIDE_GREY;
    }
};

const getAllGuides = function () {
    const allItems = [];
    for (let i = 0; i < paper.project.layers.length; i++) {
        const layer = paper.project.layers[i];
        for (let j = 0; j < layer.children.length; j++) {
            const child = layer.children[j];
            // only give guides
            if (!child.guide) {
                continue;
            }
            allItems.push(child);
        }
    }
    return allItems;
};

const getExportRectGuide = function () {
    const guides = getAllGuides();
    for (let i = 0; i < guides.length; i++){
        if (guides[i].data && guides[i].data.isExportRect) {
            return guides[i];
        }
    }
};


const removeHelperItems = function () {
    removePaperItemsByDataTags(['isHelperItem']);
};


const removeAllGuides = function () {
    removePaperItemsByTags(['guide']);
};


const removeExportRectGuide = function () {
    removePaperItemsByDataTags(['isExportRect']);
};


export {
    hoverItem,
    hoverBounds,
    rectSelect,
    line,
    crossPivot,
    rotPivot,
    label,
    removeAllGuides,
    removeHelperItems,
    removeExportRectGuide,
    getAllGuides,
    getExportRectGuide,
    getGuideColor,
    setDefaultGuideStyle
};
