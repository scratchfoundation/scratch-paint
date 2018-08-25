import paper from '@scratch/paper';
import log from '../log/log';

const SAVE_ZOOM_LEVEL = 'scratch-paint/zoom-levels/SAVE_ZOOM_LEVEL';
const SET_ZOOM_CLASS = 'scratch-paint/zoom-levels/SET_ZOOM_CLASS';
const initialState = {};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_ZOOM_CLASS:
        if (action.zoomClass === 'currentZoomClass') {
            log.warn(`currentZoomClass is an invalid string for zoomClass`);
            return state;
        }
        return Object.assign({}, state, {
            currentZoomClass: action.zoomClass
        });
    case SAVE_ZOOM_LEVEL:
        return Object.assign({}, state, {
            [state.currentZoomClass]: action.zoomLevel
        });
    default:
        return state;
    }
};

// Action creators ==================================
const saveZoomLevel = function (zoomLevel) {
    if (!(zoomLevel instanceof paper.Matrix)) {
        log.warn(`Not a matrix: ${zoomLevel}`);
    }
    return {
        type: SAVE_ZOOM_LEVEL,
        zoomLevel: new paper.Matrix(zoomLevel)
    };
};
const setZoomClass = function (zoomClass) {
    return {
        type: SET_ZOOM_CLASS,
        zoomClass: zoomClass
    };
};

export {
    reducer as default,
    saveZoomLevel,
    setZoomClass
};
