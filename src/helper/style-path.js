import paper from '@scratch/paper';
import {getSelectedLeafItems} from './selection';
import {isPGTextItem, isPointTextItem} from './item';
import {isGroup} from './group';
import {getItems} from './selection';
import GradientTypes from '../lib/gradient-types';

const MIXED = 'scratch-paint/style-path/mixed';

// Check if the item color matches the incoming color. If the item color is a gradient, we assume
// that the incoming color never matches, since we don't support gradients yet.
const _colorMatch = function (itemColor, incomingColor) {
    // @todo check whether the gradient has changed when we support gradients
    if (itemColor && itemColor.type === 'gradient') return false;
    // Either both are null or both are the same color when converted to CSS.
    return (!itemColor && !incomingColor) ||
            (itemColor && incomingColor && itemColor.toCSS() === new paper.Color(incomingColor).toCSS());
};

// Selected items and currently active text edit items respond to color changes.
const _getColorStateListeners = function (textEditTargetId) {
    const items = getSelectedLeafItems();
    if (textEditTargetId) {
        const matches = getItems({
            match: item => item.id === textEditTargetId
        });
        if (matches.length) {
            items.push(matches[0]);
        }
    }
    return items;
};

/**
 * Called when setting fill color
 * @param {string} colorString New color, css format
 * @param {?boolean} bitmapMode True if the fill color is being set in bitmap mode
 * @param {?string} textEditTargetId paper.Item.id of text editing target, if any
 * @return {boolean} Whether the color application actually changed visibly.
 */
const applyFillColorToSelection = function (colorString, bitmapMode, textEditTargetId) {
    const items = _getColorStateListeners(textEditTargetId);
    let changed = false;
    for (let item of items) {
        if (isPointTextItem(item) && !colorString) {
            colorString = 'rgba(0,0,0,0)';
        } else if (item.parent instanceof paper.CompoundPath) {
            item = item.parent;
        }
        // In bitmap mode, fill color applies to the stroke if there is a stroke
        if (bitmapMode && item.strokeColor !== null && item.strokeWidth !== 0) {
            if (!_colorMatch(item.strokeColor, colorString)) {
                changed = true;
                item.strokeColor = colorString;
            }
        } else if (!_colorMatch(item.fillColor, colorString)) {
            changed = true;
            item.fillColor = colorString;
        }
    }
    return changed;
};

/**
 * Called when setting stroke color
 * @param {string} colorString New color, css format
 * @param {?boolean} bitmapMode True if the stroke color is being set in bitmap mode
 * @param {?string} textEditTargetId paper.Item.id of text editing target, if any
 * @return {boolean} Whether the color application actually changed visibly.
 */
const applyStrokeColorToSelection = function (colorString, bitmapMode, textEditTargetId) {
    // Bitmap mode doesn't have stroke color
    if (bitmapMode) return false;

    const items = _getColorStateListeners(textEditTargetId);
    let changed = false;
    for (let item of items) {
        if (item.parent instanceof paper.CompoundPath) {
            item = item.parent;
        }
        if (isPGTextItem(item)) {
            if (item.children) {
                for (const child of item.children) {
                    if (child.children) {
                        for (const path of child.children) {
                            if (!path.data.isPGGlyphRect) {
                                if (!_colorMatch(path.strokeColor, colorString)) {
                                    changed = true;
                                    path.strokeColor = colorString;
                                }
                            }
                        }
                    } else if (!child.data.isPGGlyphRect) {
                        if (child.strokeColor !== colorString) {
                            changed = true;
                            child.strokeColor = colorString;
                        }
                    }
                }
            } else if (!item.data.isPGGlyphRect) {
                if (!_colorMatch(item.strokeColor, colorString)) {
                    changed = true;
                    item.strokeColor = colorString;
                }
            }
        } else if (!_colorMatch(item.strokeColor, colorString)) {
            changed = true;
            item.strokeColor = colorString;
        }
    }
    return changed;
};

/**
 * Called when setting stroke width
 * @param {number} value New stroke width
 * @param {?string} textEditTargetId paper.Item.id of text editing target, if any
 * @return {boolean} Whether the color application actually changed visibly.
 */
const applyStrokeWidthToSelection = function (value, textEditTargetId) {
    let changed = false;
    const items = _getColorStateListeners(textEditTargetId);
    for (let item of items) {
        if (item.parent instanceof paper.CompoundPath) {
            item = item.parent;
        }
        if (isGroup(item)) {
            continue;
        } else if (item.strokeWidth !== value) {
            item.strokeWidth = value;
            changed = true;
        }
    }
    return changed;
};

/**
 * Get state of colors and stroke width for selection
 * @param {!Array<paper.Item>} selectedItems Selected paper items
 * @param {?boolean} bitmapMode True if the item is being selected in bitmap mode
 * @return {?object} Object of strokeColor, strokeWidth, fillColor, thickness of the selection.
 *     Gives MIXED when there are mixed values for a color, and null for transparent.
 *     Gives null when there are mixed values for stroke width.
 *     Thickness is line thickness, used in the bitmap editor
 */
const getColorsFromSelection = function (selectedItems, bitmapMode) {
    let selectionFillColorString;
    let selectionFillColor2String;
    let selectionStrokeColorString;
    let selectionStrokeWidth;
    let selectionThickness;
    let selectionGradientType;
    let firstChild = true;

    for (let item of selectedItems) {
        if (item.parent instanceof paper.CompoundPath) {
            // Compound path children inherit fill and stroke color from their parent.
            item = item.parent;
        }
        let itemFillColorString;
        let itemFillColor2String;
        let itemStrokeColorString;
        let itemGradientType = GradientTypes.SOLID;

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
                if (isPointTextItem(item) && item.fillColor.alpha === 0) {
                    itemFillColorString = null;
                } else if (item.fillColor.type === 'gradient') {
                    // Scratch only recognizes 2 color gradients
                    if (item.fillColor.gradient.stops.length === 2) {
                        if (item.fillColor.gradient.radial) {
                            itemGradientType = GradientTypes.RADIAL;
                        } else {
                            // Always use horizontal for linear gradients, since horizontal and vertical gradients
                            // are the same with rotation. We don't want to show MIXED just because anything is rotated.
                            itemGradientType = GradientTypes.HORIZONTAL;
                        }
                        itemFillColorString = item.fillColor.gradient.stops[0].color.alpha === 0 ?
                            null :
                            item.fillColor.gradient.stops[0].color.toCSS();
                        itemFillColor2String = item.fillColor.gradient.stops[1].color.alpha === 0 ?
                            null :
                            item.fillColor.gradient.stops[1].color.toCSS();
                    } else {
                        itemFillColorString = MIXED;
                        itemFillColor2String = null;
                    }
                } else {
                    itemFillColorString = item.fillColor.alpha === 0 ?
                        null :
                        item.fillColor.toCSS();
                }
            }
            if (item.strokeColor) {
                // Stroke color is fill color in bitmap
                if (bitmapMode) {
                    itemFillColorString = item.strokeColor.toCSS();
                } else if (item.strokeColor.type === 'gradient') {
                    itemStrokeColorString = MIXED;
                } else {
                    itemStrokeColorString = item.strokeColor.alpha === 0 ?
                        null :
                        item.strokeColor.toCSS();
                }
            }
            // check every style against the first of the items
            if (firstChild) {
                firstChild = false;
                selectionFillColorString = itemFillColorString;
                selectionFillColor2String = itemFillColor2String;
                selectionStrokeColorString = itemStrokeColorString;
                selectionGradientType = itemGradientType;
                selectionStrokeWidth = item.strokeWidth;
                if (item.strokeWidth && item.data && item.data.zoomLevel) {
                    selectionThickness = item.strokeWidth / item.data.zoomLevel;
                }
            }
            // True if gradient would match if flipped
            const gradientMatchesFlipped = itemGradientType === GradientTypes.HORIZONTAL &&
                itemFillColorString === selectionFillColor2String &&
                itemFillColor2String === selectionFillColorString;
            // If item fill color doesn't match selection fill color
            if (!gradientMatchesFlipped &&
                    (itemFillColorString !== selectionFillColorString ||
                    itemFillColor2String !== selectionFillColor2String ||
                    itemGradientType !== selectionGradientType)) {
                selectionFillColorString = MIXED;
                selectionFillColor2String = null;
                selectionGradientType = GradientTypes.SOLID;
            }
            if (itemStrokeColorString !== selectionStrokeColorString) {
                selectionStrokeColorString = MIXED;
            }
            if (selectionStrokeWidth !== item.strokeWidth) {
                selectionStrokeWidth = null;
            }
        }
    }
    // Convert selection gradient type from horizontal to vertical if first item is exactly vertical
    if (selectionGradientType !== GradientTypes.SOLID) {
        const direction = selectedItems[0].fillColor.destination.subtract(selectedItems[0].fillColor.origin);
        if (Math.abs(direction.angle) === 90) {
            selectionGradientType = GradientTypes.VERTICAL;
        }
    }
    if (bitmapMode) {
        return {
            fillColor: selectionFillColorString ? selectionFillColorString : null,
            fillColor2: selectionFillColor2String ? selectionFillColor2String : null,
            gradientType: selectionGradientType,
            thickness: selectionThickness
        };
    }
    return {
        fillColor: selectionFillColorString ? selectionFillColorString : null,
        fillColor2: selectionFillColor2String ? selectionFillColor2String : null,
        gradientType: selectionGradientType,
        strokeColor: selectionStrokeColorString ? selectionStrokeColorString : null,
        strokeWidth: selectionStrokeWidth || (selectionStrokeWidth === null) ? selectionStrokeWidth : 0
    };
};

const styleBlob = function (path, options) {
    if (options.isEraser) {
        path.fillColor = 'white';
    } else if (options.fillColor) {
        path.fillColor = options.fillColor;
    } else {
        // Make sure something visible is drawn
        path.fillColor = 'black';
    }
};

const stylePath = function (path, strokeColor, strokeWidth) {
    // Make sure a visible line is drawn
    path.setStrokeColor(
        (strokeColor === MIXED || strokeColor === null) ? 'black' : strokeColor);
    path.setStrokeWidth(
        strokeWidth === null || strokeWidth === 0 ? 1 : strokeWidth);
};

const styleCursorPreview = function (path, options) {
    if (options.isEraser) {
        path.fillColor = 'white';
        path.strokeColor = 'cornflowerblue';
        path.strokeWidth = 1;
    } else if (options.fillColor) {
        path.fillColor = options.fillColor;
    } else {
        // Make sure something visible is drawn
        path.fillColor = 'black';
    }
};

const styleShape = function (path, options) {
    path.fillColor = options.fillColor;
    path.strokeColor = options.strokeColor;
    path.strokeWidth = options.strokeWidth;
};

export {
    applyFillColorToSelection,
    applyStrokeColorToSelection,
    applyStrokeWidthToSelection,
    getColorsFromSelection,
    MIXED,
    styleBlob,
    styleShape,
    stylePath,
    styleCursorPreview
};
