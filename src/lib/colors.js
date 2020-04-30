import parseColor from 'parse-color';

const COLORS = {
    RED:'#ff0000',
    ORANGE:'#fd8c2f',
    YELLOW:'#fed91e',
    GREEN:'#4be05e',
    LIGHT_BLUE:'#80dbff',
    BLUE:'#3364ff',
    PURPLE:'#9966ff',
    BLACK:'#000000',
    WHITE:'#ffffff',
    UMBER:'#4c392b',
    CHOCOLATE:'#755135',
    BROWN:'#b5875c',
    TAN:'#edc393',
    PEACH:'#f7dcc3'
};

const getAllColors = function () {
    const colors = [];
    for (let item in COLORS) {
        if (isNaN(Number(item))) {
            const color = parseColor(COLORS[item]).rgb;
            colors.push(`rgb(${color[0]},${color[1]},${color[2]})`);
        }
    }
    return colors;
}

export default getAllColors;