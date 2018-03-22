import log from '../log/log';

const SMOOTH = 'scratch-paint/blob/SMOOTH';
const initialState = false;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SMOOTH:
        if (typeof action.smooth === 'boolean') {
            return action.smooth;
        }
        log.warn(`Smooth must be boolean: ${action.smooth}`);
        /* falls through */
    default:
        return state;
    }
};

// Action creators ==================================
const setSmooth = function (shouldSmooth) {
    return {
        type: SMOOTH,
        smooth: shouldSmooth
    };
};

export {
    reducer as default,
    setSmooth
};
