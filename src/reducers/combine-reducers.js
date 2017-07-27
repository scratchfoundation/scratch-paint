import {combineReducers} from 'redux';
import toolReducer from './tools';
import brushToolReducer from './brush-tool';
import eraserToolReducer from './eraser-tool';

export default combineReducers({
    tool: toolReducer,
    brushTool: brushToolReducer,
    eraserTool: eraserToolReducer
});
