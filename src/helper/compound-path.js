const isCompoundPath = function (item) {
    return item && item.className === 'CompoundPath';
};

const isCompoundPathChild = function (item) {
    if (item.parent) {
        return item.parent.className === 'CompoundPath';
    }
    return false;
};


const getItemsCompoundPath = function (item) {
    const itemParent = item.parent;

    if (isCompoundPath(itemParent)) {
        return itemParent;
    }
    return null;
    
};


// const createFromSelection = function () {
//     const items = getSelectedPaths();
//     if (items.length < 2) return;
    
//     const path = new paper.CompoundPath({fillRule: 'evenodd'});
    
//     for (let i = 0; i < items.length; i++) {
//         path.addChild(items[i]);
//         items[i].selected = false;
//     }
    
//     path = pg.stylebar.applyActiveToolbarStyle(path);
    
//     pg.selection.setItemSelection(path, true);
//     pg.undo.snapshot('createCompoundPathFromSelection');
// };


// const releaseSelection = function () {
//     const items = pg.selection.getSelectedItems();
    
//     const cPathsToDelete = [];
//     for (const i=0; i<items.length; i++) {
//         const item = items[i];
        
//         if (isCompoundPath(item)) {
            
//             for (const j=0; j<item.children.length; j++) {
//                 const path = item.children[j];
//                 path.parent = item.layer;
//                 pg.selection.setItemSelection(path, true);
//                 j--;
//             }
//             cPathsToDelete.push(item);
//             pg.selection.setItemSelection(item, false);
            
//         } else {
//             items[i].parent = item.layer;
//         }
//     }
    
//     for (const j=0; j<cPathsToDelete.length; j++) {
//         cPathsToDelete[j].remove();
//     }
//     pg.undo.snapshot('releaseCompoundPath');
// };


export {
    isCompoundPath,
    isCompoundPathChild,
    getItemsCompoundPath
    // createFromSelection,
    // releaseSelection
};
