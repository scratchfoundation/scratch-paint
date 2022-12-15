import log from '../log/log';

const CHANGE_HOVERED = 'scratch-paint/hover/CHANGE_HOVERED';
const CLEAR_REMOVED = 'scratch-paint/hover/CLEAR_REMOVED';
const initialState = {
    hoveredItemId: null,
    removedItemIds: []
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_HOVERED: {
        if (typeof action.hoveredItemId === 'undefined') {
            log.warn(`Hovered item should not be set to undefined. Use null.`);
            return state;
        } else if (isNaN(action.hoveredItemId)) {
            log.warn(`Hovered item should be an item ID number. Got: ${action.hoveredItemId}`);
            return state;
        }
        const removedItemIds = [...state.removedItemIds];
        if (state.hoveredItemId) {
            removedItemIds.push(state.hoveredItemId);
        }
        return {
            hoveredItemId: action.hoveredItemId,
            removedItemIds
        };
    }
    case CLEAR_REMOVED: {
        if (typeof action.itemId === 'undefined') {
            log.warn(`Cleared item should not be set to undefined. Use null.`);
            return state;
        } else if (isNaN(action.itemId)) {
            log.warn(`Cleared item should be an item ID number. Got: ${action.hoveredItemId}`);
            return state;
        }
        return {
            ...state,
            removedItemIds: state.removedItemIds.filter(removedItemId => removedItemId !== action.itemId)
        };
    }
    default:
        return state;
    }
};

// Action creators ==================================
/**
 * Set the hovered item state to the given item ID
 * @param {number} hoveredItemId The paper.Item ID of the hover indicator item.
 * @return {object} Redux action to change the hovered item.
 */
const setHoveredItem = function (hoveredItemId) {
    return {
        type: CHANGE_HOVERED,
        hoveredItemId: hoveredItemId
    };
};

const clearHoveredItem = function () {
    return {
        type: CHANGE_HOVERED,
        hoveredItemId: null
    };
};

const clearRemovedItem = function (itemId) {
    return {
        type: CLEAR_REMOVED,
        itemId
    };
};

export {
    reducer as default,
    setHoveredItem,
    clearHoveredItem,
    clearRemovedItem
};
