import log from '../log/log';

const CHANGE_LINE_WIDTH = 'scratch-paint/line-mode/CHANGE_LINE_WIDTH';
const initialState = {lineWidth: 2};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_LINE_WIDTH:
        if (isNaN(action.lineWidth)) {
            log.warn(`Invalid line width: ${action.lineWidth}`);
            return state;
        }
        return {lineWidth: Math.max(1, action.lineWidth)};
    default:
        return state;
    }
};

// Action creators ==================================
const changeLineWidth = function (lineWidth) {
    return {
        type: CHANGE_LINE_WIDTH,
        lineWidth: lineWidth
    };
};

export {
    reducer as default,
    changeLineWidth
};
