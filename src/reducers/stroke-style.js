import makeColorStyleReducer from '../lib/make-color-style-reducer';

const CHANGE_STROKE_COLOR = 'scratch-paint/stroke-style/CHANGE_STROKE_COLOR';
const CHANGE_STROKE_COLOR_2 = 'scratch-paint/stroke-style/CHANGE_STROKE_COLOR_2';
const CHANGE_STROKE_GRADIENT_TYPE = 'scratch-paint/stroke-style/CHANGE_STROKE_GRADIENT_TYPE';
const CLEAR_STROKE_GRADIENT = 'scratch-paint/stroke-style/CLEAR_STROKE_GRADIENT';
const DEFAULT_COLOR = '#000000';

const reducer = makeColorStyleReducer({
    changePrimaryColorAction: CHANGE_STROKE_COLOR,
    changeSecondaryColorAction: CHANGE_STROKE_COLOR_2,
    changeGradientTypeAction: CHANGE_STROKE_GRADIENT_TYPE,
    clearGradientAction: CLEAR_STROKE_GRADIENT,
    defaultColor: DEFAULT_COLOR,
    selectionPrimaryColorKey: 'strokeColor',
    selectionSecondaryColorKey: 'strokeColor2',
    selectionGradientTypeKey: 'strokeGradientType'
});

// Action creators ==================================
const changeStrokeColor = function (strokeColor) {
    return {
        type: CHANGE_STROKE_COLOR,
        color: strokeColor
    };
};

const changeStrokeColor2 = function (strokeColor) {
    return {
        type: CHANGE_STROKE_COLOR_2,
        color: strokeColor
    };
};

const changeStrokeGradientType = function (gradientType) {
    return {
        type: CHANGE_STROKE_GRADIENT_TYPE,
        gradientType
    };
};

const clearStrokeGradient = function () {
    return {
        type: CLEAR_STROKE_GRADIENT
    };
};

export {
    reducer as default,
    changeStrokeColor,
    changeStrokeColor2,
    changeStrokeGradientType,
    clearStrokeGradient,
    DEFAULT_COLOR,
    CHANGE_STROKE_GRADIENT_TYPE
};
