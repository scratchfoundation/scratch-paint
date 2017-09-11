/* eslint-env jest */
import strokeColorReducer from '../../src/reducers/stroke-color';
import {changeStrokeColor} from '../../src/reducers/stroke-color';

test('initialState', () => {
    let defaultState;

    expect(strokeColorReducer(defaultState /* state */, {type: 'anything'} /* action */)).toBeDefined();
});

test('changeStrokeColor', () => {
    let defaultState;

    // 3 value hex code
    let newStrokeColor = '#fff';
    expect(strokeColorReducer(defaultState /* state */, changeStrokeColor(newStrokeColor) /* action */))
        .toEqual(newStrokeColor);
    expect(strokeColorReducer('#010' /* state */, changeStrokeColor(newStrokeColor) /* action */))
        .toEqual(newStrokeColor);

    // 6 value hex code
    newStrokeColor = '#facade';
    expect(strokeColorReducer(defaultState /* state */, changeStrokeColor(newStrokeColor) /* action */))
        .toEqual(newStrokeColor);
    expect(strokeColorReducer('#010' /* state */, changeStrokeColor(newStrokeColor) /* action */))
        .toEqual(newStrokeColor);
});

test('invalidChangeStrokeColor', () => {
    const origState = '#fff';

    expect(strokeColorReducer(origState /* state */, changeStrokeColor() /* action */))
        .toBe(origState);
    expect(strokeColorReducer(origState /* state */, changeStrokeColor('#') /* action */))
        .toBe(origState);
    expect(strokeColorReducer(origState /* state */, changeStrokeColor('#1') /* action */))
        .toBe(origState);
    expect(strokeColorReducer(origState /* state */, changeStrokeColor('#12') /* action */))
        .toBe(origState);
    expect(strokeColorReducer(origState /* state */, changeStrokeColor('#1234') /* action */))
        .toBe(origState);
    expect(strokeColorReducer(origState /* state */, changeStrokeColor('#12345') /* action */))
        .toBe(origState);
    expect(strokeColorReducer(origState /* state */, changeStrokeColor('#1234567') /* action */))
        .toBe(origState);
    expect(strokeColorReducer(origState /* state */, changeStrokeColor('invalid argument') /* action */))
        .toBe(origState);
});
