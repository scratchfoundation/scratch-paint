import {MIXED} from '../helper/style-path';
import paper from '@scratch/paper';

const makeColor = function(h, s, v) {
    const color = new paper.Color({hue:h, saturation:s, brightness:v});

    // Convert color's backing components to HSV a.k.a. HSB
    color.type = 'hsb';
    return color;
}

const ROW_1_COLORS = {
    RED: makeColor(0,1,1),
    ORANGE: makeColor(27,0.81,1),
    YELLOW: makeColor(50,0.88,1),
    GREEN: makeColor(128,0.67,0.88),
    LIGHT_BLUE: makeColor(197,0.5,1),
    BLUE: makeColor(226,0.8,1),
    PURPLE: makeColor(259,0.6,1),
};

const ROW_2_COLORS = {
    BLACK: makeColor(0,1,0),
    WHITE: makeColor(0,0,1),
    UMBER: makeColor(25,0.43,0.3),
    CHOCOLATE: makeColor(26,0.55,0.46),
    BROWN: makeColor(29,0.49,0.71),
    TAN: makeColor(32,0.38,0.93),
    PEACH: makeColor(29,0.21,0.97),
};

const _getColors = function (colorEnum) {
    const keys = [];
    for (const key in colorEnum) {
        if (colorEnum.hasOwnProperty(key)) keys.push(key);
    }
    return keys;
};

const getRow1Colors = function () {
    return _getColors(ROW_1_COLORS);
};

const getRow2Colors = function () {
    return _getColors(ROW_2_COLORS);
};

const getColorName = function (key) {
    return key.toLowerCase().replace('_', ' ');
};

/** Convert from paper.Color object to Scratch's 0-100 hsv */
const getHsv = function (colorObj) {
    const isTransparent = colorObj === null;
    const isMixed = colorObj === MIXED;
    return isTransparent || isMixed ?
        [50, 100, 100] : [
            colorObj.hue * (100 / 360),
            colorObj.saturation * 100,
            colorObj.brightness * 100
        ];
}

const getColorObj = function (key) {
    return ROW_1_COLORS[key] ? ROW_1_COLORS[key] : ROW_2_COLORS[key];
};

export {
    getRow1Colors,
    getRow2Colors,
    getColorObj,
    getColorName,
    getHsv
};
