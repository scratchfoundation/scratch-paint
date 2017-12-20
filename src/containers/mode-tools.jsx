import paper from '@scratch/paper';
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';

import ModeToolsComponent from '../components/mode-tools/mode-tools.jsx';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items';
import {incrementPasteOffset, setClipboardItems} from '../reducers/clipboard';
import {clearSelection, getSelectedLeafItems, getSelectedRootItems} from '../helper/selection';

class ModeTools extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'hasSelectedPoints',
            'handleCopyToClipboard',
            'handlePasteFromClipboard'
        ]);
    }
    hasSelectedPoints () {
        const selectedItems = getSelectedLeafItems();
        for (const item of selectedItems) {
            for (const seg of item.segments) {
                if (seg.selected) {
                    return true;
                }
            }
        }
        return false;
    }
    handleCopyToClipboard () {
        const selectedItems = getSelectedRootItems();
        if (selectedItems.length > 0) {
            const clipboardItems = [];
            for (let i = 0; i < selectedItems.length; i++) {
                const jsonItem = selectedItems[i].exportJSON({asString: false});
                clipboardItems.push(jsonItem);
            }
            this.props.setClipboardItems(clipboardItems);
        }
    }
    handlePasteFromClipboard () {
        clearSelection(this.props.clearSelectedItems);

        if (this.props.clipboardItems.length > 0) {
            for (let i = 0; i < this.props.clipboardItems.length; i++) {
                const item = paper.Base.importJSON(this.props.clipboardItems[i]);
                if (item) {
                    item.selected = true;
                }
                const placedItem = paper.project.getActiveLayer().addChild(item);
                placedItem.position.x += 10 * this.props.pasteOffset;
                placedItem.position.y += 10 * this.props.pasteOffset;
            }
            this.props.incrementPasteOffset();
            this.props.setSelectedItems();
            paper.project.view.update();
            this.props.onUpdateSvg();
        }
    }
    render () {
        return (
            <ModeToolsComponent
                hasSelectedPoints={this.hasSelectedPoints()}
                onCopyToClipboard={this.handleCopyToClipboard}
                onPasteFromClipboard={this.handlePasteFromClipboard}
            />
        );
    }
}

ModeTools.propTypes = {
    clearSelectedItems: PropTypes.func.isRequired,
    clipboardItems: PropTypes.arrayOf(PropTypes.array),
    incrementPasteOffset: PropTypes.func.isRequired,
    onUpdateSvg: PropTypes.func.isRequired,
    pasteOffset: PropTypes.number,
    // Listen on selected items to update hasSelectedPoints
    selectedItems: PropTypes.arrayOf(PropTypes.instanceOf(paper.Item)), // eslint-disable-line react/no-unused-prop-types
    setClipboardItems: PropTypes.func.isRequired,
    setSelectedItems: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    clipboardItems: state.scratchPaint.clipboard.items,
    pasteOffset: state.scratchPaint.clipboard.pasteOffset,
    selectedItems: state.scratchPaint.selectedItems
});
const mapDispatchToProps = dispatch => ({
    setClipboardItems: items => {
        dispatch(setClipboardItems(items));
    },
    incrementPasteOffset: () => {
        dispatch(incrementPasteOffset());
    },
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    setSelectedItems: () => {
        dispatch(setSelectedItems(getSelectedLeafItems()));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModeTools);
