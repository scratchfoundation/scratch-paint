import PaintEditor from './containers/paint-editor.jsx';
import SelectionHOV from './containers/selection-hov.jsx';
import ScratchPaintReducer from './reducers/scratch-paint-reducer';

const Wrapped = SelectionHOV(PaintEditor);

export {
    Wrapped as default,
    ScratchPaintReducer
};
