import GradientTypes from '../lib/gradient-types';
import log from '../log/log';

const CHANGE_FILL_MODE_GRADIENT_TYPE = 'scratch-paint/fill-mode-gradient-type/CHANGE_FILL_MODE_GRADIENT_TYPE';
const initialState = GradientTypes.SOLID;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_FILL_MODE_GRADIENT_TYPE:
        if (action.gradientType in GradientTypes) {
            return action.gradientType;
        }
        log.warn(`Gradient type does not exist: ${action.gradientType}`);
        /* falls through */
    default:
        return state;
    }
};

// Action creators ==================================
const changeFillModeGradientType = function (gradientType) {
    return {
        type: CHANGE_FILL_MODE_GRADIENT_TYPE,
        gradientType: gradientType
    };
};

export {
    reducer as default,
    changeFillModeGradientType
};
