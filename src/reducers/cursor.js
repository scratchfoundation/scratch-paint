import log from '../log/log';

import Cursors from '../lib/cursors';

const CHANGE_CURSOR = 'scratch-paint/cursor/CHANGE_CURSOR';
const initialState = Cursors.DEFAULT;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_CURSOR:
        if (typeof action.cursorString === 'undefined') {
            log.warn(`Cursor should not be set to undefined. Use 'default'.`);
            return state;
        } else if (!Object.values(Cursors).includes(action.cursorString)) {
            log.warn(`Cursor should be a valid cursor string. Got: ${action.cursorString}`);
        }
        return action.cursorString;
    default:
        return state;
    }
};

// Action creators ==================================
/**
 * Set the mouse cursor state to the given string
 * @param {string} cursorString The CSS cursor string.
 * @return {object} Redux action to change the cursor.
 */
const setCursor = function (cursorString) {
    return {
        type: CHANGE_CURSOR,
        cursorString: cursorString
    };
};

export {
    reducer as default,
    setCursor
};
