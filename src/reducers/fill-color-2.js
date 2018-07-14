import log from '../log/log';
import {CHANGE_SELECTED_ITEMS} from './selected-items';
import {CLEAR_GRADIENT} from './selection-gradient-type';
import {getColorsFromSelection} from '../helper/style-path';

const CHANGE_FILL_COLOR_2 = 'scratch-paint/fill-color/CHANGE_FILL_COLOR_2';
const initialState = null;
// Matches hex colors
const regExp = /^#([0-9a-f]{3}){1,2}$/i;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_FILL_COLOR_2:
        if (!regExp.test(action.fillColor) && action.fillColor !== null) {
            log.warn(`Invalid hex color code: ${action.fillColor}`);
            return state;
        }
        return action.fillColor;
    case CHANGE_SELECTED_ITEMS:
        // Don't change state if no selection
        if (!action.selectedItems || !action.selectedItems.length) {
            return state;
        }
        return getColorsFromSelection(action.selectedItems).fillColor2;
    case CLEAR_GRADIENT:
        // TODO pick random color here
        console.log('set fill color 2 clear');
        return null;
    default:
        return state;
    }
};

// Action creators ==================================
const changeFillColor2 = function (fillColor) {
    return {
        type: CHANGE_FILL_COLOR_2,
        fillColor: fillColor
    };
};

export {
    reducer as default,
    changeFillColor2
};
