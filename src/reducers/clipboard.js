import log from '../log/log';

const SET = 'scratch-paint/clipboard/SET';
const initialState = [];

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET:
        if (!action.clipboardItems || !(action.clipboardItems instanceof Array) || action.clipboardItems.length === 0) {
            log.warn(`Invalid clipboard item format`);
            return state;
        }
        return action.clipboardItems;
    default:
        return state;
    }
};

// Action creators ==================================
const setClipboardItems = function (clipboardItems) {
    return {
        type: SET,
        clipboardItems: clipboardItems
    };
};

export {
    reducer as default,
    setClipboardItems
};
