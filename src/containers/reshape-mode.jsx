import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../modes/modes';

import {changeMode} from '../reducers/modes';
import {setHoveredItem, clearHoveredItem} from '../reducers/hover';

import {getHoveredItem} from '../helper/hover';
import {rectSelect} from '../helper/guides';
import {processRectangularSelection} from '../helper/selection';

import ReshapeModeComponent from '../components/reshape-mode.jsx';
import BoundingBoxTool from '../helper/bounding-box/bounding-box-tool';
import paper from 'paper';

class ReshapeMode extends React.Component {
    static get TOLERANCE () {
        return 8;
    }
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool',
            'getHitOptions'
        ]);

        this._hitOptionsSelected = {
            match: function (item) {
                if (!item.item || !item.item.selected) return;
                if (item.type === 'handle-out' || item.type === 'handle-in') {
                    // Only hit test against handles that are visible, that is,
                    // their segment is selected
                    if (!item.segment.selected) {
                        return false;
                    }
                    // If the entire shape is selected, handles are hidden
                    if (item.item.fullySelected) {
                        return false;
                    }
                }
                return true;
            },
            segments: true,
            stroke: true,
            curves: true,
            handles: true,
            fill: true,
            guide: false
        };
        this._hitOptions = {
            match: function (item) {
                if (item.type === 'handle-out' || item.type === 'handle-in') {
                    // Only hit test against handles that are visible, that is,
                    // their segment is selected
                    if (!item.segment.selected) {
                        return false;
                    }
                    // If the entire shape is selected, handles are hidden
                    if (item.item.fullySelected) {
                        return false;
                    }
                }
                return true;
            },
            segments: true,
            stroke: true,
            curves: true,
            handles: true,
            fill: true,
            guide: false
        };
        this.boundingBoxTool = new BoundingBoxTool();
        this.selectionBoxMode = false;
        this.selectionRect = null;
    }
    componentDidMount () {
        if (this.props.isReshapeModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.isReshapeModeActive && !this.props.isReshapeModeActive) {
            this.activateTool();
        } else if (!nextProps.isReshapeModeActive && this.props.isReshapeModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate () {
        return false; // Static component, for now
    }
    getHitOptions (preselectedOnly) {
        this._hitOptions.tolerance = ReshapeMode.TOLERANCE / paper.view.zoom;
        this._hitOptionsSelected.tolerance = ReshapeMode.TOLERANCE / paper.view.zoom;
        return preselectedOnly ? this._hitOptionsSelected : this._hitOptions;
    }
    activateTool () {
        paper.settings.handleSize = 8;
        this.boundingBoxTool.setSelectionBounds();
        this.tool = new paper.Tool();

        const reshapeMode = this;

        this.tool.onMouseDown = function (event) {
            if (event.event.button > 0) return; // only first mouse button

            reshapeMode.props.clearHoveredItem();
            if (!reshapeMode.boundingBoxTool
                .onMouseDown(
                    event,
                    event.modifiers.alt,
                    event.modifiers.shift,
                    reshapeMode.getHitOptions(false /* preseelectedOnly */))) {
                reshapeMode.selectionBoxMode = true;
            }
        };

        this.tool.onMouseMove = function (event) {
            const hoveredItem = getHoveredItem(event, reshapeMode.getHitOptions());
            const oldHoveredItem = reshapeMode.props.hoveredItem;
            if ((!hoveredItem && oldHoveredItem) || // There is no longer a hovered item
                    (hoveredItem && !oldHoveredItem) || // There is now a hovered item
                    (hoveredItem && oldHoveredItem && hoveredItem.id !== oldHoveredItem.id)) { // hovered item changed
                reshapeMode.props.setHoveredItem(hoveredItem);
            }
        };

        
        this.tool.onMouseDrag = function (event) {
            if (event.event.button > 0) return; // only first mouse button

            if (reshapeMode.selectionBoxMode) {
                reshapeMode.selectionRect = rectSelect(event);
                // Remove this rect on the next drag and up event
                reshapeMode.selectionRect.removeOnDrag();
            } else {
                reshapeMode.boundingBoxTool.onMouseDrag(event);
            }
        };

        this.tool.onMouseUp = function (event) {
            if (event.event.button > 0) return; // only first mouse button

            if (reshapeMode.selectionBoxMode) {
                if (reshapeMode.selectionRect) {
                    processRectangularSelection(event, reshapeMode.selectionRect, Modes.RESHAPE);
                    reshapeMode.selectionRect.remove();
                }
                reshapeMode.boundingBoxTool.setSelectionBounds();
            } else {
                reshapeMode.boundingBoxTool.onMouseUp(event);
                reshapeMode.props.onUpdateSvg();
            }
            reshapeMode.selectionBoxMode = false;
            reshapeMode.selectionRect = null;
        };
        this.tool.activate();
    }
    deactivateTool () {
        paper.settings.handleSize = 0;
        this.props.clearHoveredItem();
        this.tool.remove();
        this.tool = null;
        this.hitResult = null;
    }
    render () {
        return (
            <ReshapeModeComponent onMouseDown={this.props.handleMouseDown} />
        );
    }
}

ReshapeMode.propTypes = {
    clearHoveredItem: PropTypes.func.isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    hoveredItem: PropTypes.instanceOf(paper.Item), // eslint-disable-line react/no-unused-prop-types
    isReshapeModeActive: PropTypes.bool.isRequired,
    onUpdateSvg: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
    setHoveredItem: PropTypes.func.isRequired // eslint-disable-line react/no-unused-prop-types
};

const mapStateToProps = state => ({
    isReshapeModeActive: state.scratchPaint.mode === Modes.RESHAPE,
    hoveredItem: state.scratchPaint.hoveredItem
});
const mapDispatchToProps = dispatch => ({
    setHoveredItem: hoveredItem => {
        dispatch(setHoveredItem(hoveredItem));
    },
    clearHoveredItem: () => {
        dispatch(clearHoveredItem());
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.RESHAPE));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReshapeMode);
