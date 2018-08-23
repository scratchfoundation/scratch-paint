import PaintEditor from './containers/paint-editor.jsx';
import CopyPasteHOC from './containers/copy-paste-hoc.jsx';
import SelectionHOC from './containers/selection-hoc.jsx';
import ScratchPaintReducer from './reducers/scratch-paint-reducer';

const Wrapped = SelectionHOC(CopyPasteHOC(PaintEditor));

export {
    Wrapped as default,
    ScratchPaintReducer
};
