/* eslint-env jest */
import Formats from '../../src/lib/format';
import reducer from '../../src/reducers/format';
import {changeFormat} from '../../src/reducers/format';
import {undo, redo} from '../../src/reducers/undo';

test('initialState', () => {
    let defaultState;
    expect(reducer(defaultState /* state */, {type: 'anything'} /* action */) in Formats).toBeTruthy();
});

test('changeFormat', () => {
    let defaultState;
    expect(reducer(defaultState /* state */, changeFormat(Formats.BITMAP) /* action */)).toBe(Formats.BITMAP);
    expect(reducer(Formats.BITMAP /* state */, changeFormat(Formats.BITMAP) /* action */))
        .toBe(Formats.BITMAP);
    expect(reducer(Formats.BITMAP /* state */, changeFormat(Formats.VECTOR) /* action */))
        .toBe(Formats.VECTOR);
});

test('undoRedoChangeFormat', () => {
    let defaultState;
    let reduxState = reducer(defaultState /* state */, changeFormat(Formats.BITMAP) /* action */);
    expect(reduxState).toBe(Formats.BITMAP);
    reduxState = reducer(reduxState /* state */, undo(Formats.UNDO_BITMAP) /* action */);
    expect(reduxState).toBe(Formats.UNDO_BITMAP);
    reduxState = reducer(reduxState /* state */, redo(Formats.UNDO_VECTOR) /* action */);
    expect(reduxState).toBe(Formats.UNDO_VECTOR);
});

test('invalidChangeMode', () => {
    expect(reducer(Formats.BITMAP /* state */, changeFormat('non-existant mode') /* action */))
        .toBe(Formats.BITMAP);
    expect(reducer(Formats.BITMAP /* state */, changeFormat() /* action */)).toBe(Formats.BITMAP);
});
