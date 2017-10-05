import {getSelectedLeafItems} from './selection';
import {isPGTextItem, isPointTextItem} from './item';
import {isGroup} from './group';
import {performSnapshot} from './undo';

const MIXED = 'scratch-paint/style-path/mixed';

/**
 * Called when setting fill color
 * @param {string} colorString New color, css format
 */
const applyFillColorToSelection = function (colorString, undoSnapshot) {
    const items = getSelectedLeafItems();
    for (const item of items) {
        if (isPGTextItem(item)) {
            for (const child of item.children) {
                if (child.children) {
                    for (const path of child.children) {
                        if (!path.data.isPGGlyphRect) {
                            path.fillColor = colorString;
                        }
                    }
                } else if (!child.data.isPGGlyphRect) {
                    child.fillColor = colorString;
                }
            }
        } else {
            if (isPointTextItem(item) && !colorString) {
                colorString = 'rgba(0,0,0,0)';
            }
            item.fillColor = colorString;
        }
    }
    performSnapshot(undoSnapshot);
};

/**
 * Called when setting stroke color
 * @param {string} colorString New color, css format
 */
const applyStrokeColorToSelection = function (colorString, undoSnapshot) {
    const items = getSelectedLeafItems();

    for (const item of items) {
        if (isPGTextItem(item)) {
            if (item.children) {
                for (const child of item.children) {
                    if (child.children) {
                        for (const path of child.children) {
                            if (!path.data.isPGGlyphRect) {
                                path.strokeColor = colorString;
                            }
                        }
                    } else if (!child.data.isPGGlyphRect) {
                        child.strokeColor = colorString;
                    }
                }
            } else if (!item.data.isPGGlyphRect) {
                item.strokeColor = colorString;
            }
        } else {
            item.strokeColor = colorString;
        }
    }
    performSnapshot(undoSnapshot);
};

/**
 * Called when setting stroke width
 * @param {number} value New stroke width
 */
const applyStrokeWidthToSelection = function (value, undoSnapshot) {
    const items = getSelectedLeafItems();
    for (const item of items) {
        if (isGroup(item)) {
            continue;
        } else {
            item.strokeWidth = value;
        }
    }
    performSnapshot(undoSnapshot);
};

/**
 * Get state of colors and stroke width for selection
 * @param {!Array<paper.Item>} selectedItems Selected paper items
 * @return {object} Object of strokeColor, strokeWidth, fillColor of the selection.
 *     Gives MIXED when there are mixed values for a color, and null for transparent.
 *     Gives null when there are mixed values for stroke width.
 */
const getColorsFromSelection = function (selectedItems) {
    let selectionFillColorString;
    let selectionStrokeColorString;
    let selectionStrokeWidth;
    let firstChild = true;
    
    for (const item of selectedItems) {
        let itemFillColorString;
        let itemStrokeColorString;
        
        // handle pgTextItems differently by going through their children
        if (isPGTextItem(item)) {
            for (const child of item.children) {
                for (const path of child.children) {
                    if (!path.data.isPGGlyphRect) {
                        if (path.fillColor) {
                            itemFillColorString = path.fillColor.toCSS();
                        }
                        if (path.strokeColor) {
                            itemStrokeColorString = path.strokeColor.toCSS();
                        }
                        // check every style against the first of the items
                        if (firstChild) {
                            firstChild = false;
                            selectionFillColorString = itemFillColorString;
                            selectionStrokeColorString = itemStrokeColorString;
                            selectionStrokeWidth = path.strokeWidth;
                        }
                        if (itemFillColorString !== selectionFillColorString) {
                            selectionFillColorString = MIXED;
                        }
                        if (itemStrokeColorString !== selectionStrokeColorString) {
                            selectionStrokeColorString = MIXED;
                        }
                        if (selectionStrokeWidth !== path.strokeWidth) {
                            selectionStrokeWidth = null;
                        }
                    }
                }
            }
        } else if (!isGroup(item)) {
            if (item.fillColor) {
                // hack bc text items with null fill can't be detected by fill-hitTest anymore
                if (isPointTextItem(item) && item.fillColor.toCSS() === 'rgba(0,0,0,0)') {
                    itemFillColorString = null;
                } else {
                    itemFillColorString = item.fillColor.toCSS();
                }
            }
            if (item.strokeColor) {
                itemStrokeColorString = item.strokeColor.toCSS();
            }
            // check every style against the first of the items
            if (firstChild) {
                firstChild = false;
                selectionFillColorString = itemFillColorString;
                selectionStrokeColorString = itemStrokeColorString;
                selectionStrokeWidth = item.strokeWidth;
            }
            if (itemFillColorString !== selectionFillColorString) {
                selectionFillColorString = MIXED;
            }
            if (itemStrokeColorString !== selectionStrokeColorString) {
                selectionStrokeColorString = MIXED;
            }
            if (selectionStrokeWidth !== item.strokeWidth) {
                selectionStrokeWidth = null;
            }
        }
    }
    return {
        fillColor: selectionFillColorString ? selectionFillColorString : null,
        strokeColor: selectionStrokeColorString ? selectionStrokeColorString : null,
        strokeWidth: selectionStrokeWidth || (selectionStrokeWidth === null) ? selectionStrokeWidth : 0
    };
};

const stylePath = function (path, options) {
    if (options.isEraser) {
        path.fillColor = 'white';
    } else {
        if (options.fillColor) {
            path.fillColor = options.fillColor;
        } else {
            // Make sure something visible is drawn
            path.fillColor = 'black';
        }   
    }
};

const styleCursorPreview = function (path, options) {
    if (options.isEraser) {
        path.fillColor = 'white';
        path.strokeColor = 'cornflowerblue';
        path.strokeWidth = 1;
    } else {
        if (options.fillColor) {
            path.fillColor = options.fillColor;
        } else {
            // Make sure something visible is drawn
            path.fillColor = 'black';
        }
    }
};

export {
    applyFillColorToSelection,
    applyStrokeColorToSelection,
    applyStrokeWidthToSelection,
    getColorsFromSelection,
    MIXED,
    stylePath,
    styleCursorPreview
};
