/* eslint-env jest */
import clipboardReducer from '../../src/reducers/clipboard';
import {setClipboardItems} from '../../src/reducers/clipboard';

test('initialState', () => {
    let defaultState;

    expect(clipboardReducer(defaultState /* state */, {type: 'anything'} /* action */)).toBeDefined();
});

test('setClipboardItems', () => {
    let defaultState;

    const newSelected1 = ['selected1', 'selected2'];
    const newSelected2 = ['selected1', 'selected3'];
    expect(clipboardReducer(defaultState /* state */, setClipboardItems(newSelected1) /* action */))
        .toEqual(newSelected1);
    expect(clipboardReducer(newSelected1, setClipboardItems(newSelected2) /* action */))
        .toEqual(newSelected2);
});

test('invalidSetClipboardItems', () => {
    const origState = ['selected1', 'selected2'];
    const nothingSelected = [];

    expect(clipboardReducer(origState /* state */, setClipboardItems() /* action */))
        .toBe(origState);
    expect(clipboardReducer(origState /* state */, setClipboardItems('notAnArray') /* action */))
        .toBe(origState);
    expect(clipboardReducer(origState /* state */, setClipboardItems(nothingSelected) /* action */))
        .toBe(origState);
});
