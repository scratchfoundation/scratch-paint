import log from '../log/log';

const CHANGE_STROKE_COLOR = 'scratch-paint/stroke-color/CHANGE_STROKE_COLOR';
const initialState = '#000';
// Matches hex colors
const regExp = /^#([0-9a-f]{3}){1,2}$/i;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_STROKE_COLOR:
        if (!regExp.test(action.strokeColor)) {
            log.warn(`Invalid hex color code: ${action.fillColor}`);
            return state;
        }
        return action.strokeColor;
    default:
        return state;
    }
};

// Action creators ==================================
const changeStrokeColor = function (strokeColor) {
    return {
        type: CHANGE_STROKE_COLOR,
        strokeColor: strokeColor
    };
};

export {
    reducer as default,
    changeStrokeColor
};
