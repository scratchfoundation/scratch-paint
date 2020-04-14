import log from '../log/log';
import {CHANGE_SELECTED_ITEMS} from './selected-items';
import {CLEAR_GRADIENT} from './selection-gradient-type';
import {getColorsFromSelection, MIXED} from '../helper/style-path';
import GradientTypes from '../lib/gradient-types';

const CHANGE_FILL_COLOR = 'scratch-paint/fill-color/CHANGE_FILL_COLOR';
const CHANGE_FILL_COLOR_2 = 'scratch-paint/fill-color/CHANGE_FILL_COLOR_2';
const DEFAULT_COLOR = '#9966FF';
const initialState = {
    primary: DEFAULT_COLOR,
    secondary: null
};

// Matches hex colors
const hexRegex = /^#([0-9a-f]{3}){1,2}$/i;

const isValidHexColor = color => {
    if (!hexRegex.test(color) && color !== null && color !== MIXED) {
        log.warn(`Invalid hex color code: ${color}`);
        return false;
    }
    return true;
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_FILL_COLOR:
        if (!isValidHexColor(action.fillColor)) return state;
        return {...state, primary: action.fillColor};
    case CHANGE_FILL_COLOR_2:
        if (!isValidHexColor(action.fillColor)) return state;
        return {...state, secondary: action.fillColor};
    case CHANGE_SELECTED_ITEMS: {
        // Don't change state if no selection
        if (!action.selectedItems || !action.selectedItems.length) {
            return state;
        }
        const colors = getColorsFromSelection(action.selectedItems, action.bitmapMode);

        const newState = {...state, primary: colors.fillColor};

        // Gradient type may be solid when multiple gradient types are selected.
        // In this case, changing the first color should not change the second color.
        if (colors.gradientType !== GradientTypes.SOLID || colors.fillColor2 === MIXED) {
            newState.secondary = colors.fillColor2;
        }
        return newState;
    }
    case CLEAR_GRADIENT:
        return {...state, secondary: null};
    default:
        return state;
    }
};

// Action creators ==================================
const changeFillColor = function (fillColor) {
    return {
        type: CHANGE_FILL_COLOR,
        fillColor
    };
};

const changeFillColor2 = function (fillColor) {
    return {
        type: CHANGE_FILL_COLOR_2,
        fillColor
    };
};

export {
    reducer as default,
    changeFillColor,
    changeFillColor2,
    DEFAULT_COLOR
};
