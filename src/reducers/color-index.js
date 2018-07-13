import log from '../log/log';

const CHANGE_COLOR_INDEX = 'scratch-paint/color-index/CHANGE_COLOR_INDEX';
const initialState = 0;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_COLOR_INDEX:
        if (action.index !== 1 && action.index !== 0) {
            log.warn(`Invalid color index: ${action.index}`);
            return state;
        }
        return action.index;
    default:
        return state;
    }
};

// Action creators ==================================
const changeColorIndex = function (index) {
    return {
        type: CHANGE_COLOR_INDEX,
        index: index
    };
};

export {
    reducer as default,
    changeColorIndex
};
