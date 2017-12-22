import log from '../log/log';
const CHANGE_SELECTED_ITEMS = 'scratch-paint/select/CHANGE_SELECTED_ITEMS';
const initialState = [];

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_SELECTED_ITEMS:
        if (!action.selectedItems || !(action.selectedItems instanceof Array)) {
            log.warn(`No selected items or wrong format provided: ${action.selectedItems}`);
            return state;
        }
        // If they are both empty, no change
        if (action.selectedItems.length === 0 && state.length === 0) {
            return state;
        }
        return action.selectedItems;
    default:
        return state;
    }
};

// Action creators ==================================
/**
 * Set the selected item state to the given array of items
 * @param {Array<paper.Item>} selectedItems from paper.project.selectedItems
 * @return {object} Redux action to change the selected items.
 */
const setSelectedItems = function (selectedItems) {
    return {
        type: CHANGE_SELECTED_ITEMS,
        selectedItems: selectedItems
    };
};
const clearSelectedItems = function () {
    return {
        type: CHANGE_SELECTED_ITEMS,
        selectedItems: []
    };
};

export {
    reducer as default,
    setSelectedItems,
    clearSelectedItems,
    CHANGE_SELECTED_ITEMS
};
