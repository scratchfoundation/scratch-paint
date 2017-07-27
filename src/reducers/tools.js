import ToolTypes from '../tools/tool-types';
import log from '../log/log';

const CHANGE_TOOL = 'scratch-paint/tools/CHANGE_TOOL';
const initialState = ToolTypes.BRUSH;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_TOOL:
        if (action.tool in ToolTypes) {
            return action.tool;
        }
        log.warn(`Tool type does not exist: ${action.tool}`);
        /* falls through */
    default:
        return state;
    }
};

// Action creators ==================================
reducer.changeTool = function (tool) {
    return {
        type: CHANGE_TOOL,
        tool: tool
    };
};

export default reducer;
