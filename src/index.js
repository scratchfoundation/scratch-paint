import PaintEditor from './containers/paint-editor.jsx';
import SelectionHOC from './containers/selection-hoc.jsx';
import ScratchPaintReducer from './reducers/scratch-paint-reducer';

const Wrapped = SelectionHOC(PaintEditor);

export {
    Wrapped as default,
    ScratchPaintReducer
};
