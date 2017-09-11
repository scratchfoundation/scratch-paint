// function related to groups and grouping

pg.group = function() {

	var groupSelection = function() {
		var items = pg.selection.getSelectedItems();
		if(items.length > 0) {
			var group = new paper.Group(items);
			pg.selection.clearSelection();
			pg.selection.setItemSelection(group, true);
			for (var i = 0; i < group.children.length; i++) {
				group.children[i].selected = true;
			}
			pg.undo.snapshot('groupSelection');
			jQuery(document).trigger('Grouped');
			return group;
		} else {
			return false;
		}
	};
	
	
	var ungroupSelection = function() {
		var items = pg.selection.getSelectedItems();
		ungroupItems(items);
		pg.statusbar.update();
	};
	
	
	var groupItems = function(items) {
		if(items.length > 0) {
			var group = new paper.Group(items);
			jQuery(document).trigger('Grouped');
			pg.undo.snapshot('groupItems');
			return group;
		} else {
			return false;
		}
	};


	// ungroup items (only top hierarchy)
	var ungroupItems = function(items) {
		pg.selection.clearSelection();
		var emptyGroups = [];
		for(var i=0; i<items.length; i++) {
			var item = items[i];
			if(isGroup(item) && !item.data.isPGTextItem) {
				ungroupLoop(item, false /* recursive */);

				if(!item.hasChildren()) {
					emptyGroups.push(item);
				}
			}
		}

		// remove all empty groups after ungrouping
		for(var j=0; j<emptyGroups.length; j++) {
			emptyGroups[j].remove();
		}
		jQuery(document).trigger('Ungrouped');
		pg.undo.snapshot('ungroupItems');
	};


	var ungroupLoop = function(group, recursive) {
		// don't ungroup items that are not groups
		if(!group || !group.children || !isGroup(group)) return;
				
		group.applyMatrix = true;
		// iterate over group children recursively
		for(var i=0; i<group.children.length; i++) {
			var groupChild = group.children[i];
			if(groupChild.hasChildren()) {
				// recursion (groups can contain groups, ie. from SVG import)
				if(recursive) {
					ungroupLoop(groupChild, true /* recursive */);
					continue;
				}
			}
			groupChild.applyMatrix = true;
			// move items from the group to the activeLayer (ungrouping)
			groupChild.insertBelow(group);
			groupChild.selected = true;
			i--;
		}
	};


	var getItemsGroup = function(item) {
		var itemParent = item.parent;

		if(isGroup(itemParent)) {
			return itemParent;
		} else {
			return null;
		}
	};


	var isGroup = function(item) {
		return pg.item.isGroupItem(item);
	};
	
	
	var isGroupChild = function(item) {
		var rootItem = pg.item.getRootItem(item);
		return isGroup(rootItem);
	};

	var shouldShowGroup = function() {
		var items = pg.selection.getSelectedItems();
		return items.length > 1;
	};
	
	var shouldShowUngroup = function() {
		var items = pg.selection.getSelectedItems();
		for(var i=0; i<items.length; i++) {
			var item = items[i];
			if(isGroup(item) && !item.data.isPGTextItem && item.children && item.children.length > 0) {
				return true;
			}
		}
		return false;
	};

	return {
		groupSelection: groupSelection,
		ungroupSelection: ungroupSelection,
		groupItems: groupItems,
		ungroupItems: ungroupItems,
		getItemsGroup: getItemsGroup,
		isGroup: isGroup,
		isGroupChild:isGroupChild,
		shouldShowGroup:shouldShowGroup,
		shouldShowUngroup:shouldShowUngroup
	};

}();