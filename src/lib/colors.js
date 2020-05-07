import parseColor from 'parse-color';

const COLORS = {
    RED: '#ff0000',
    ORANGE: '#fd8c2f',
    YELLOW: '#fed91e',
    GREEN: '#4be05e',
    LIGHT_BLUE: '#80dbff',
    BLUE: '#3364ff',
    PURPLE: '#9966ff',
    BLACK: '#000000',
    WHITE: '#ffffff',
    UMBER: '#4c392b',
    CHOCOLATE: '#755135',
    BROWN: '#b5875c',
    TAN: '#edc393',
    PEACH: '#f7dcc3'
};

const getAllColors = function () {
    const keys = [];
    for (const key in COLORS) {
        if (COLORS.hasOwnProperty(key)) keys.push(key);
    }
    return keys;
};

const getColorName = function (key) {
    return key.toLowerCase().replace('_', ' ');
};

const getColorRGB = function (key) {
    const rgb = parseColor(COLORS[key]).rgb;
    return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
};

export {
    getAllColors,
    getColorRGB,
    getColorName
};
