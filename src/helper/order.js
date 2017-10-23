import {getSelectedRootItems} from './selection';

const bringToFront = function (onUpdateSvg) {
    const items = getSelectedRootItems();
    for (const item of items) {
        item.bringToFront();
    }
    onUpdateSvg();
};

const sendToBack = function (onUpdateSvg) {
    const items = getSelectedRootItems();
    for (let i = items.length - 1; i >= 0; i--) {
        items[i].sendToBack();
    }
    onUpdateSvg();
};

const bringForward = function (onUpdateSvg) {
    const items = getSelectedRootItems();
    // Already at front
    if (items.length === 0 || !items[items.length - 1].nextSibling) {
        return;
    }

    const nextSibling = items[items.length - 1].nextSibling;
    for (let i = items.length - 1; i >= 0; i--) {
        items[i].insertAbove(nextSibling);
    }
    onUpdateSvg();
};

const sendBackward = function (onUpdateSvg) {
    const items = getSelectedRootItems();
    // Already at front
    if (items.length === 0 || !items[0].previousSibling) {
        return;
    }

    const previousSibling = items[0].previousSibling;
    for (const item of items) {
        item.insertBelow(previousSibling);
    }
    onUpdateSvg();
};

const shouldShowSendBackward = function () {
    const items = getSelectedRootItems();
    if (items.length === 0 || !items[0].previousSibling) {
        return false;
    }
    return true;
};

const shouldShowBringForward = function () {
    const items = getSelectedRootItems();
    if (items.length === 0 || !items[items.length - 1].nextSibling) {
        return false;
    }
    return true;
};

export {
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    shouldShowBringForward,
    shouldShowSendBackward
};
