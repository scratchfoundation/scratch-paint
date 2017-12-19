import paper from '@scratch/paper';
import {isBoundsItem, getRootItem} from './item';
import {hoverBounds, hoverItem} from './guides';
import {isGroupChild} from './group';
import {sortItemsByZIndex} from './math';

/**
 * @param {!MouseEvent} event mouse event
 * @param {?object} hitOptions hit options to use
 * @param {?boolean} subselect Whether items within groups can be hovered. If false, the
 *    entire group should be hovered.
 * @return {paper.Item} the hovered item or null if there is none
 */
const getHoveredItem = function (event, hitOptions, subselect) {
    // @todo make hit test only hit painting layer
    const hitResults = paper.project.hitTestAll(event.point, hitOptions);
    if (hitResults.length === 0) {
        return null;
    }
    // sort items by z-index
    const items = [];
    for (const hitResult of hitResults) {
        if (!(hitResult.item.data && hitResult.item.data.noHover) && !hitResult.item.selected) {
            items.push(hitResult.item);
        }
    }
    items.sort(sortItemsByZIndex);

    const item = items[items.length - 1];
    if (!item) {
        return null;
    }

    if (isBoundsItem(item)) {
        return hoverBounds(item);
    } else if (!subselect && isGroupChild(item)) {
        return hoverBounds(getRootItem(item));
    }
    return hoverItem(item);
};

export {
    getHoveredItem
};
