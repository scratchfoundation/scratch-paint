/* eslint-env jest */
import fillColorReducer from '../../src/reducers/fill-color';
import {changeFillColor} from '../../src/reducers/fill-color';
import {setSelectedItems} from '../../src/reducers/selected-items';
import {MIXED} from '../../src/helper/style-path';
import {mockPaperRootItem} from '../__mocks__/paperMocks';

test('initialState', () => {
    let defaultState;

    expect(fillColorReducer(defaultState /* state */, {type: 'anything'} /* action */)).toBeDefined();
});

test('changeFillColor', () => {
    let defaultState;

    // 3 value hex code
    let newFillColor = '#fff';
    expect(fillColorReducer(defaultState /* state */, changeFillColor(newFillColor) /* action */))
        .toEqual(newFillColor);
    expect(fillColorReducer('#010' /* state */, changeFillColor(newFillColor) /* action */))
        .toEqual(newFillColor);

    // 6 value hex code
    newFillColor = '#facade';
    expect(fillColorReducer(defaultState /* state */, changeFillColor(newFillColor) /* action */))
        .toEqual(newFillColor);
    expect(fillColorReducer('#010' /* state */, changeFillColor(newFillColor) /* action */))
        .toEqual(newFillColor);
});

test('changefillColorViaSelectedItems', () => {
    let defaultState;

    const fillColor1 = 6;
    const fillColor2 = null; // transparent
    let selectedItems = [mockPaperRootItem({fillColor: fillColor1})];
    expect(fillColorReducer(defaultState /* state */, setSelectedItems(selectedItems) /* action */))
        .toEqual(fillColor1);
    selectedItems = [mockPaperRootItem({fillColor: fillColor2})];
    expect(fillColorReducer(defaultState /* state */, setSelectedItems(selectedItems) /* action */))
        .toEqual(fillColor2);
    selectedItems = [mockPaperRootItem({fillColor: fillColor1}), mockPaperRootItem({fillColor: fillColor2})];
    expect(fillColorReducer(defaultState /* state */, setSelectedItems(selectedItems) /* action */))
        .toEqual(MIXED);
});

test('invalidChangeFillColor', () => {
    const origState = '#fff';

    expect(fillColorReducer(origState /* state */, changeFillColor() /* action */))
        .toBe(origState);
    expect(fillColorReducer(origState /* state */, changeFillColor('#') /* action */))
        .toBe(origState);
    expect(fillColorReducer(origState /* state */, changeFillColor('#1') /* action */))
        .toBe(origState);
    expect(fillColorReducer(origState /* state */, changeFillColor('#12') /* action */))
        .toBe(origState);
    expect(fillColorReducer(origState /* state */, changeFillColor('#1234') /* action */))
        .toBe(origState);
    expect(fillColorReducer(origState /* state */, changeFillColor('#12345') /* action */))
        .toBe(origState);
    expect(fillColorReducer(origState /* state */, changeFillColor('#1234567') /* action */))
        .toBe(origState);
    expect(fillColorReducer(origState /* state */, changeFillColor('invalid argument') /* action */))
        .toBe(origState);
});
