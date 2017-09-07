import {combineReducers} from 'redux';
import modeReducer from './modes';
import brushModeReducer from './brush-mode';
import eraserModeReducer from './eraser-mode';
import lineModeReducer from './line-mode';
import colorReducer from './color';

export default combineReducers({
    mode: modeReducer,
    brushMode: brushModeReducer,
    eraserMode: eraserModeReducer,
    lineMode: lineModeReducer,
    color: colorReducer
});
