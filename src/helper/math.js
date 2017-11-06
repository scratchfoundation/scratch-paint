import paper from '@scratch/paper';

const checkPointsClose = function (startPos, eventPoint, threshold) {
    const xOff = Math.abs(startPos.x - eventPoint.x);
    const yOff = Math.abs(startPos.y - eventPoint.y);
    if (xOff < threshold && yOff < threshold) {
        return true;
    }
    return false;
};

const getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomBoolean = function () {
    return getRandomInt(0, 2) === 1;
};

// Thanks Mikko Mononen! https://github.com/memononen/stylii
const snapDeltaToAngle = function (delta, snapAngle) {
    let angle = Math.atan2(delta.y, delta.x);
    angle = Math.round(angle / snapAngle) * snapAngle;
    const dirx = Math.cos(angle);
    const diry = Math.sin(angle);
    const d = (dirx * delta.x) + (diry * delta.y);
    return new paper.Point(dirx * d, diry * d);
};

const sortItemsByZIndex = function (a, b) {
    if (a === null || b === null) {
        // Incomparable
        return null;
    }
    let tempA = a;
    let tempB = b;
    while (!(tempA instanceof paper.Layer)) {
        while (!(tempB instanceof paper.Layer)) {
            if (tempB === tempA) {
                return 0;
            } else if (tempB.parent === tempA.parent) {
                return parseFloat(tempA.index) - parseFloat(tempB.index);
            }
            tempB = tempB.parent;
        }
        tempA = tempA.parent;
    }
    // No shared hierarchy
    return null;
};

// Expand the size of the path by approx one pixel all around
const expandByOne = function (path) {
    const center = path.position;
    for (const seg of path.segments) {
        const norm = seg.point.subtract(center).normalize();
        seg.point = seg.point.add(norm);
    }
};

export {
    checkPointsClose,
    expandByOne,
    getRandomInt,
    getRandomBoolean,
    snapDeltaToAngle,
    sortItemsByZIndex
};
