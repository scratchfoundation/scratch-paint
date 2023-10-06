/* eslint-env jest */
import reducer, {clearHoveredItem, clearRemovedItem, setHoveredItem} from '../../src/reducers/hover';

const defaultState = {hoveredItemId: null, removedItemIds: []};

test('initialState', () => {
    // eslint-disable-next-line no-undefined
    expect(reducer(undefined /* state */, {type: 'anything'} /* action */)).toEqual(defaultState);
});

test('setHoveredItem', () => {
    const item1 = 1;
    const item2 = 2;

    // eslint-disable-next-line no-undefined
    let updatedState = reducer(undefined /* state */, setHoveredItem(item1) /* action */);
    expect(updatedState.hoveredItemId).toBe(item1);

    updatedState = reducer(updatedState /* state */, setHoveredItem(item2) /* action */);
    expect(updatedState.hoveredItemId).toBe(item2);
    expect(updatedState.removedItemIds).toEqual([item1]);
});

test('clearHoveredItem', () => {
    const item = 1;

    // eslint-disable-next-line no-undefined
    expect(reducer(undefined /* state */, clearHoveredItem() /* action */).hoveredItemId).toBeNull();
    expect(
        reducer({hoveredItemId: item, removedItemIds: []} /* state */, clearHoveredItem() /* action */).hoveredItemId
    ).toBeNull();
});

test('invalidSetHoveredItem', () => {
    const nonItem = {random: 'object'};
    const nonDefaultState = {hoveredItemId: 1, removedItemIds: [2]};

    // eslint-disable-next-line no-undefined
    expect(reducer(undefined /* state */, setHoveredItem(nonItem) /* action */)).toEqual(defaultState);
    expect(reducer(nonDefaultState /* state */, setHoveredItem(nonItem) /* action */))
        .toBe(nonDefaultState);
    // eslint-disable-next-line no-undefined
    expect(reducer(nonDefaultState /* state */, setHoveredItem(undefined) /* action */))
        .toBe(nonDefaultState);
});

test('clearRemovedItem', () => {
    const initialState = {
        hoveredItemId: null,
        removedItemIds: [1, 2, 3]
    };

    const updatedState = reducer(initialState /* state */, clearRemovedItem(2) /* action */);

    expect(updatedState.removedItemIds).toEqual([1, 3]);
});

test('invalidClearRemovedItem', () => {
    const nonItem = {random: 'object'};
    const nonDefaultState = {hoveredItemId: 1, removedItemIds: [2]};

    // eslint-disable-next-line no-undefined
    expect(reducer(undefined /* state */, clearRemovedItem(nonItem) /* action */)).toEqual(defaultState);
    expect(reducer(nonDefaultState /* state */, clearRemovedItem(nonItem) /* action */))
        .toBe(nonDefaultState);
    // eslint-disable-next-line no-undefined
    expect(reducer(nonDefaultState /* state */, clearRemovedItem(undefined) /* action */))
        .toBe(nonDefaultState);
});
