import paper from 'paper';

var mode = 'none';
var selectionRect;

var itemGroup;
var pivot;
var corner;
var origPivot;
var origSize;
var origCenter;
var scaleItems;
var scaleItemsInsertBelow;

var rotItems = [];
var rotGroupPivot;
var prevRot = [];

class BoundingBoxTool extends paper.Tool {
    onMouseDown: If BoundingBoxTool got a hit result, switch to bounding box tool as the primary tool.
    Else switch to the default tool.

    Where should the move tool be handled? Might make sense on bounding box tool since whenever the bounding
    box is active, move is possible

    Shift button handling? If you shift click, bounding box tool wants to add it to the selection. But shape tools
    probably don't.
        - If shift is held down during mouse click, don't switch to the bounding box tool even if it gets a hit?
        Then we can decide how to deal with it differently for different modes.

    Alt button handling?
        - Same as shift?




    onMouseDown (event) {
        if(event.event.button > 0) return;  // only first mouse button
        clearHoveredItem();
        
        const hitResults = paper.project.hitTestAll(event.point, this.getHitOptions());
        // Prefer scale to trigger over rotate, since their regions overlap
        if (hitResults && hitResults.length > 0) {
            let hitResult = hitResults[0];
            for (let i = 0; i < hitResults.length; i++) {
                if (hitResults[i].item.data && hitResults[i].item.data.isScaleHandle) {
                    hitResult = hitResults[i];
                    this.mode = 'scale';
                    break;
                } else if (hitResults[i].item.data && hitResults[i].item.data.isRotHandle) {
                    hitResult = hitResults[i];
                    this.mode = 'rotate';
                }
            }
            if (mode === 'rotate') {
                rotGroupPivot = boundsPath.bounds.center;
                rotItems = pg.selection.getSelectedItems();
                
                jQuery.each(rotItems, function(i, item) {
                    prevRot[i] = (event.point - rotGroupPivot).angle;
                });
            } else if (mode === 'scale') {
                var index = hitResult.item.data.index;                  
                pivot = boundsPath.bounds[getOpposingRectCornerNameByIndex(index)].clone();
                origPivot = boundsPath.bounds[getOpposingRectCornerNameByIndex(index)].clone();
                corner = boundsPath.bounds[getRectCornerNameByIndex(index)].clone();
                origSize = corner.subtract(pivot);
                origCenter = boundsPath.bounds.center;
                scaleItems = pg.selection.getSelectedItems();
            } 
            else { // Move mode
                // deselect all by default if the shift key isn't pressed
                // also needs some special love for compound paths and groups,
                // as their children are not marked as "selected"
                // deselect a currently selected item if shift is pressed
                var root = pg.item.getRootItem(hitResult.item);
                if(pg.item.isCompoundPathItem(root) || pg.group.isGroup(root)) {
                    if(!root.selected) {
                        if (!event.modifiers.shift) {
                            pg.selection.clearSelection()
                        }
                        root.selected = true;
                        for (var i = 0; i < root.children.length; i++) {
                            root.children[i].selected = true;
                        }
                        jQuery(document).trigger('SelectionChanged');
                        if(event.modifiers.alt) {
                            mode = 'cloneMove';
                            pg.selection.cloneSelection();

                        } else {
                            mode = 'move';
                        }
                    } else {
                        if (event.modifiers.shift) {
                            root.selected = false;
                            for (var i = 0; i < root.children.length; i++) {
                                root.children[i].selected = false;
                            }
                        } else {
                            if(event.modifiers.alt) {
                                mode = 'cloneMove';
                                pg.selection.cloneSelection();

                            } else {
                                mode = 'move';
                            }
                        }
                    }
                } else if(hitResult.item.selected) {
                    if (event.modifiers.shift) {
                        pg.selection.setItemSelection(hitResult.item, false);
                    } else {
                        if(event.modifiers.alt) {
                            mode = 'cloneMove';
                            pg.selection.cloneSelection();

                        } else {
                            mode = 'move';
                        }
                    }
                } else {
                    if (!event.modifiers.shift) {
                        pg.selection.clearSelection()
                    }
                    pg.selection.setItemSelection(hitResult.item, true);

                    if(event.modifiers.alt) {
                        mode = 'cloneMove';
                        pg.selection.cloneSelection();

                    } else {
                        mode = 'move';
                    }
                }
            }
            // while transforming object, never show the bounds stuff
            removeBoundsPath();
        } else {
            if (!event.modifiers.shift) {
                removeBoundsPath();
                pg.selection.clearSelection();
            }
            mode = 'rectSelection';
        }
    }
    onMouseDrag (event) {
        if(event.event.button > 0) return; // only first mouse button
        
        var modOrigSize = origSize;
        
        if(mode == 'rectSelection') {
            selectionRect = pg.guides.rectSelect(event);
            // Remove this rect on the next drag and up event
            selectionRect.removeOnDrag();

        } else if(mode == 'scale') {
            // get index of scale items
            var items = paper.project.getItems({
                'match': function(item) {
                    if (item instanceof Layer) {
                        return false;
                    }
                    for (var i = 0; i < scaleItems.length; i++) {
                        if (!scaleItems[i].isBelow(item)) {
                            return false;
                        }
                    }
                    return true;
                }
            });
            if (items.length > 0) {
                // Lowest item above all scale items in z index
                scaleItemsInsertBelow = items[0];
            }

            itemGroup = new paper.Group(scaleItems);
            itemGroup.insertBelow(scaleItemsInsertBelow);
            itemGroup.addChild(boundsPath);
            itemGroup.data.isHelperItem = true;
            itemGroup.strokeScaling = false;
            itemGroup.applyMatrix = false;

            if (event.modifiers.alt) {
                pivot = origCenter;
                modOrigSize = origSize*0.5;
            } else {
                pivot = origPivot; 
            }

            corner = corner.add(event.delta);
            var size = corner.subtract(pivot);
            var sx = 1.0, sy = 1.0;
            if (Math.abs(modOrigSize.x) > 0.0000001) {
                sx = size.x / modOrigSize.x;
            }
            if (Math.abs(modOrigSize.y) > 0.0000001) {
                sy = size.y / modOrigSize.y;
            }

            if (event.modifiers.shift) {
                var signx = sx > 0 ? 1 : -1;
                var signy = sy > 0 ? 1 : -1;
                sx = sy = Math.max(Math.abs(sx), Math.abs(sy));
                sx *= signx;
                sy *= signy;
            }

            itemGroup.scale(sx, sy, pivot);
            
            jQuery.each(boundsScaleHandles, function(index, handle) {
                handle.position = itemGroup.bounds[getRectCornerNameByIndex(index)];
                handle.bringToFront();
            });
            
            jQuery.each(boundsRotHandles, function(index, handle) {
                if(handle) {
                    handle.position = itemGroup.bounds[getRectCornerNameByIndex(index)]+handle.data.offset;
                    handle.bringToFront();
                }
            });
            
        } else if(mode == 'rotate') {
            var rotAngle = (event.point - rotGroupPivot).angle;
            
            jQuery.each(rotItems, function(i, item) {
                
                if(!item.data.origRot) {
                    item.data.origRot = item.rotation;
                }
                
                if(event.modifiers.shift) {
                    rotAngle = Math.round(rotAngle / 45) *45;
                    item.applyMatrix = false;
                    item.pivot = rotGroupPivot;
                    item.rotation = rotAngle;
                    
                } else {
                    item.rotate(rotAngle - prevRot[i], rotGroupPivot);
                }
                prevRot[i] = rotAngle;
            });
            
        } else if(mode == 'move' || mode == 'cloneMove') {
            
            var dragVector = (event.point - event.downPoint);
            var selectedItems = pg.selection.getSelectedItems();

            for(var i=0; i<selectedItems.length; i++) {
                var item = selectedItems[i];
                // add the position of the item before the drag started
                // for later use in the snap calculation
                if(!item.data.origPos) {
                    item.data.origPos = item.position;
                }

                if (event.modifiers.shift) {
                    item.position = item.data.origPos + 
                    pg.math.snapDeltaToAngle(dragVector, Math.PI*2/8);

                } else {
                    item.position += event.delta;
                }
            }
        }
    }
    onMouseUp (event) {
        if(event.event.button > 0) return; // only first mouse button
        
        if(mode == 'rectSelection' && selectionRect) {
            pg.selection.processRectangularSelection(event, selectionRect);
            selectionRect.remove();
            
        } else if(mode == 'move' || mode == 'cloneMove') {
            
            // resetting the items origin point for the next usage
            var selectedItems = pg.selection.getSelectedItems();

            jQuery.each(selectedItems, function(index, item) {
                // remove the orig pos again
                item.data.origPos = null;           
            });
            pg.undo.snapshot('moveSelection');
            
        } else if(mode == 'scale') {
            if (itemGroup) {
                itemGroup.applyMatrix = true;
                
                // mark text items as scaled (for later use on font size calc)
                for(var i=0; i<itemGroup.children.length; i++) {
                    var child = itemGroup.children[i];
                    if(child.data.isPGTextItem) {
                        child.data.wasScaled = true;
                    }
                }

                if (scaleItemsInsertBelow) {
                    // No increment step because itemGroup.children is getting depleted
                    for (var i = 0; i < itemGroup.children.length;) {
                        itemGroup.children[i].insertBelow(scaleItemsInsertBelow);
                    }
                    scaleItemsInsertBelow = null;
                } else if (itemGroup.layer) {
                    itemGroup.layer.addChildren(itemGroup.children);
                }
                itemGroup.remove();
                pg.undo.snapshot('scaleSelection');
            }
            
        } else if(mode == 'rotate') {
            jQuery.each(rotItems, function(i, item) {
                item.applyMatrix = true;
            });
            pg.undo.snapshot('rotateSelection');
        }
        
        mode = 'none';
        selectionRect = null;
        
        if(pg.selection.getSelectedItems().length <= 0) {
            removeBoundsPath();
        } else {
            setSelectionBounds();
        }
    }
}