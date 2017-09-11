import paper from 'paper';

const CLEAR_HOVERED_ITEM = 'scratch-paint/hover/CLEAR_HOVERED_ITEM';
/**
 * @param hitOptions hit options to use
 * @param event mouse event
 * @return the hovered item or null if there is none
 */
const getHoveredItem = function (hitOptions, event) {
    const hitResults = paper.project.hitTestAll(event.point, hitOptions);
    if (hitResults.length === 0) {
        return null;
    }

    let hitResult;
    for (const result of hitResults) {
        if (!(result.item.data && result.item.data.noHover) && !hitResult.item.selected) {
            hitResult = result;
            break;
        }
    }
    if (!hitResult) {
        return null;
    }

    if (pg.item.isBoundsItem(hitResult.item)) {
        return pg.guides.hoverBounds(hitResult.item);

    } else if(pg.group.isGroupChild(hitResult.item)) {
        return pg.guides.hoverBounds(pg.item.getRootItem(hitResult.item));
        
    } else {
        return pg.guides.hoverItem(hitResult);
    }
};


// Action creators ==================================
const clearHoveredItem = function () {
    return {
        type: CLEAR_HOVERED_ITEM
    };
    // TODO: paper.view.update();
};


export {
    getHoveredItem,
    clearHoveredItem
};
