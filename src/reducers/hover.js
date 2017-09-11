const CHANGE_HOVERED = 'scratch-paint/hover/CHANGE_HOVERED';
const initialState = null;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_HOVERED:
        return action.hoveredItem;
    default:
        return state;
    }
};

// Action creators ==================================
const setHoveredItem = function (hoveredItem) {
    return {
        type: CHANGE_HOVERED,
        hoveredItem: hoveredItem
    };
};

const clearHoveredItem = function () {
    return {
        type: CHANGE_HOVERED,
        hoveredItem: null
    };
};

export {
    reducer as default,
    setHoveredItem,
    clearHoveredItem
};
