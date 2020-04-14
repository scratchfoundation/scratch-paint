import {combineReducers} from 'redux';
import eyeDropperReducer from './eye-dropper';
import fillColorReducer from './fill-color';
import gradientTypeReducer from './selection-gradient-type';
import strokeColorReducer from './stroke-color';
import strokeWidthReducer from './stroke-width';

export default combineReducers({
    eyeDropper: eyeDropperReducer,
    fillColor: fillColorReducer,
    gradientType: gradientTypeReducer,
    strokeColor: strokeColorReducer,
    strokeWidth: strokeWidthReducer
});
