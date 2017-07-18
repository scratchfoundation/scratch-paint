const test = require('tap').test;
const ToolTypes = require('../src/tools/tool-types');
const reducer = require('../src/reducers/tools');

test('initialState', t => {
    let defaultState;
    t.assert(reducer(defaultState /* state */, {type: 'anything'} /* action */) instanceof ToolTypes);
    t.end();
});

test('changeTool', t => {
    let defaultState;
    t.assert(reducer(defaultState /* state */, reducer.changeTool(ToolTypes.ERASER) /* action */), ToolTypes.ERASER);
    t.assert(
        reducer(ToolTypes.ERASER /* state */, reducer.changeTool(ToolTypes.ERASER) /* action */), ToolTypes.ERASER);
    t.assert(reducer(ToolTypes.BRUSH /* state */, reducer.changeTool(ToolTypes.ERASER) /* action */), ToolTypes.ERASER);
    t.end();
});

test('invalidChangeTool', t => {
    t.assert(
        reducer(ToolTypes.BRUSH /* state */, reducer.changeTool('non-existant tool') /* action */), ToolTypes.BRUSH);
    t.assert(reducer(ToolTypes.BRUSH /* state */, reducer.changeTool() /* action */), ToolTypes.BRUSH);
    t.end();
});
