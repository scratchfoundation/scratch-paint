import log from '../log/log';

const CHANGE_CURSOR = 'scratch-paint/cursor/CHANGE_CURSOR';
const initialState = 'default';

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_CURSOR:
        if (typeof action.cursorString === 'undefined') {
            log.warn(`Cursor should not be set to undefined. Use 'default'.`);
            return state;
        } else if (typeof action.cursorString !== 'string') {
            log.warn(`Cursor should be a string. Got: ${action.cursorString}`);
            return state;
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
