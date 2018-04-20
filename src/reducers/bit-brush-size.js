import log from '../log/log';

// Bit brush size affects bit brush width, circle/rectangle outline drawing width, and line width
// in the bitmap paint editor.
const CHANGE_BIT_BRUSH_SIZE = 'scratch-paint/brush-mode/CHANGE_BIT_BRUSH_SIZE';
const initialState = 10;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_BIT_BRUSH_SIZE:
        if (isNaN(action.brushSize)) {
            log.warn(`Invalid brush size: ${action.brushSize}`);
            return state;
        }
        return Math.max(1, action.brushSize);
    default:
        return state;
    }
};

// Action creators ==================================
const changeBitBrushSize = function (brushSize) {
    return {
        type: CHANGE_BIT_BRUSH_SIZE,
        brushSize: brushSize
    };
};

export {
    reducer as default,
    changeBitBrushSize
};
