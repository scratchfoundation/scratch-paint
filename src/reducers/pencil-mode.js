import log from '../log/log';

const CHANGE_PENCIL_SMOOTHING = 'scratch-paint/pencil-mode/CHANGE_PENCIL_SMOOTHING';
const initialState = {pencilSmoothing: 10};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_PENCIL_SMOOTHING:
        if (isNaN(action.pencilSmoothing)) {
            log.warn(`Invalid pencil smoothing: ${action.pencilSmoothing}`);
            return state;
        }
        return {pencilSmoothing: Math.max(0, action.pencilSmoothing)};
    default:
        return state;
    }
};

// Action creators ==================================
const changePencilSmoothing = function (pencilSmoothing) {
    return {
        type: CHANGE_PENCIL_SMOOTHING,
        pencilSmoothing: pencilSmoothing
    };
};

export {
    reducer as default,
    changePencilSmoothing
};
