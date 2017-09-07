import {combineReducers} from 'redux';
import fillColorReducer from './fill-color';
import strokeColorReducer from './stroke-color';

export default combineReducers({
    fillColor: fillColorReducer,
    strokeColor: strokeColorReducer
});
