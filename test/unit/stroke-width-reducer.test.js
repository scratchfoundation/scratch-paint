/* eslint-env jest */
import strokeWidthReducer from '../../src/reducers/stroke-width';
import {MAX_STROKE_WIDTH, changeStrokeWidth} from '../../src/reducers/stroke-width';

test('initialState', () => {
    let defaultState;

    expect(strokeWidthReducer(defaultState /* state */, {type: 'anything'} /* action */)).toBeDefined();
    expect(strokeWidthReducer(defaultState /* state */, {type: 'anything'} /* action */)).toBeGreaterThanOrEqual(0);
});

test('changestrokeWidth', () => {
    let defaultState;
    const newstrokeWidth = 234;

    expect(strokeWidthReducer(defaultState /* state */, changeStrokeWidth(newstrokeWidth) /* action */))
        .toEqual(newstrokeWidth);
    expect(strokeWidthReducer(1 /* state */, changeStrokeWidth(newstrokeWidth) /* action */))
        .toEqual(newstrokeWidth);
    expect(strokeWidthReducer(1 /* state */, changeStrokeWidth(-1) /* action */))
        .toEqual(0);
    expect(strokeWidthReducer(1 /* state */, changeStrokeWidth(453452352) /* action */))
        .toEqual(MAX_STROKE_WIDTH);
});

test('invalidChangestrokeWidth', () => {
    const origState = {strokeWidth: 1};

    expect(strokeWidthReducer(origState /* state */, changeStrokeWidth('invalid argument') /* action */))
        .toBe(origState);
    expect(strokeWidthReducer(origState /* state */, changeStrokeWidth() /* action */))
        .toBe(origState);
});
