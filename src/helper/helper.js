import paper from 'paper';

/**
 * @param {boolean} includeGuides True if guide layer items like the bounding box should
 *     be included in the returned items.
 * @return {Array<paper.item>} all top-level (direct descendants of a paper.Layer) items
 */
const getAllPaperItems = function (includeGuides) {
    includeGuides = includeGuides || false;
    const allItems = [];
    for (const layer of paper.project.layers) {
        for (const child of layer.children) {
            // don't give guides back
            if (!includeGuides && child.guide) {
                continue;
            }
            allItems.push(child);
        }
    }
    return allItems;
};
    
const getPaperItemsByTags = function (tags) {
    const allItems = getAllPaperItems(true);
    const foundItems = [];
    for (const item of allItems) {
        for (const tag of tags) {
            if (item[tag] && foundItems.indexOf(item) === -1) {
                foundItems.push(item);
            }
        }
    }
    return foundItems;
};

const removePaperItemsByDataTags = function (tags) {
    const allItems = getAllPaperItems(true);
    for (const item of allItems) {
        for (const tag of tags) {
            if (item.data && item.data[tag]) {
                item.remove();
            }
        }
    }
};

const removePaperItemsByTags = function (tags) {
    const allItems = getAllPaperItems(true);
    for (const item of allItems) {
        for (const tag of tags) {
            if (item[tag]) {
                item.remove();
            }
        }
    }
};

export {
    getAllPaperItems,
    getPaperItemsByTags,
    removePaperItemsByDataTags,
    removePaperItemsByTags
};
