import {combineReducers} from 'redux';
import fillColorReducer from './fill-color';
import strokeColorReducer from './stroke-color';
import strokeWidthReducer from './stroke-width';

export default combineReducers({
    fillColor: fillColorReducer,
    strokeColor: strokeColorReducer,
    strokeWidth: strokeWidthReducer
});
