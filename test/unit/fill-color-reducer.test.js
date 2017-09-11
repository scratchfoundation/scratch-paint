/* eslint-env jest */
import fillColorReducer from '../../src/reducers/fill-color';
import {changeFillColor} from '../../src/reducers/fill-color';

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
