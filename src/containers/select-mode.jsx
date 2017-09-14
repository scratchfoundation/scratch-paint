import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../modes/modes';

import {changeMode} from '../reducers/modes';
import {setHoveredItem, clearHoveredItem} from '../reducers/hover';

import {getHoveredItem} from '../helper/hover';
import {rectSelect} from '../helper/guides';
import {selectRootItem, processRectangularSelection} from '../helper/selection';

import SelectModeComponent from '../components/select-mode.jsx';
import BoundingBoxTool from '../helper/bounding-box/bounding-box-tool';
import paper from 'paper';

class SelectMode extends React.Component {
    static get TOLERANCE () {
        return 6;
    }
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool',
            'getHitOptions'
        ]);
        this._hitOptions = {
            segments: true,
            stroke: true,
            curves: true,
            fill: true,
            guide: false
        };
        this.boundingBoxTool = new BoundingBoxTool();
        this.selectionBoxMode = false;
        this.selectionRect = null;
    }
    componentDidMount () {
        if (this.props.isSelectModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.isSelectModeActive && !this.props.isSelectModeActive) {
            this.activateTool();
        } else if (!nextProps.isSelectModeActive && this.props.isSelectModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate () {
        return false; // Static component, for now
    }
    getHitOptions (preselectedOnly) {
        this._hitOptions.tolerance = SelectMode.TOLERANCE / paper.view.zoom;
        if (preselectedOnly) {
            this._hitOptions.selected = true;
        } else {
            delete this._hitOptions.selected;
        }
        return this._hitOptions;
    }
    activateTool () {
        selectRootItem();
        this.boundingBoxTool.setSelectionBounds();
        this.tool = new paper.Tool();

        // Define these to sate linter
        const selectMode = this;
        const hoveredItemProp = this.props.hoveredItem;
        const setHoveredItemProp = this.props.setHoveredItem;
        const onUpdateSvgProp = this.props.onUpdateSvg;

        this.tool.onMouseDown = function (event) {
            if (event.event.button > 0) return; // only first mouse button

            selectMode.props.clearHoveredItem();
            if (!selectMode.boundingBoxTool
                .onMouseDown(
                    event,
                    event.modifiers.alt,
                    event.modifiers.shift,
                    selectMode.getHitOptions(false /* preseelectedOnly */))) {
                selectMode.selectionBoxMode = true;
            }
        };

        this.tool.onMouseMove = function (event) {
            const hoveredItem = getHoveredItem(event, selectMode.getHitOptions());
            if ((!hoveredItem && hoveredItemProp) || // There is no longer a hovered item
                    (hoveredItem && !hoveredItemProp) || // There is now a hovered item
                    (hoveredItem && hoveredItemProp && hoveredItem.id !== hoveredItemProp.id)) { // hovered item changed
                if (hoveredItemProp) {
                    hoveredItemProp.remove();
                }
                setHoveredItemProp(hoveredItem);
            }
        };

        
        this.tool.onMouseDrag = function (event) {
            if (event.event.button > 0) return; // only first mouse button

            if (selectMode.selectionBoxMode) {
                selectMode.selectionRect = rectSelect(event);
                // Remove this rect on the next drag and up event
                selectMode.selectionRect.removeOnDrag();
            } else {
                selectMode.boundingBoxTool.onMouseDrag(event);
            }
        };

        this.tool.onMouseUp = function (event) {
            if (event.event.button > 0) return; // only first mouse button

            if (selectMode.selectionBoxMode) {
                if (selectMode.selectionRect) {
                    processRectangularSelection(event, selectMode.selectionRect, Modes.SELECT);
                    selectMode.selectionRect.remove();
                }
                selectMode.boundingBoxTool.setSelectionBounds();
            } else {
                selectMode.boundingBoxTool.onMouseUp(event);
                onUpdateSvgProp();
            }
            selectMode.selectionBoxMode = false;
            selectMode.selectionRect = null;
        };
        this.tool.activate();
    }
    deactivateTool () {
        this.props.clearHoveredItem();
        this.boundingBoxTool.removeBoundsPath();
        this.tool.remove();
        this.tool = null;
        this.hitResult = null;
    }
    render () {
        return (
            <SelectModeComponent onMouseDown={this.props.handleMouseDown} />
        );
    }
}

SelectMode.propTypes = {
    clearHoveredItem: PropTypes.func.isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    hoveredItem: PropTypes.instanceOf(paper.Item),
    isSelectModeActive: PropTypes.bool.isRequired,
    onUpdateSvg: PropTypes.func.isRequired,
    setHoveredItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    isSelectModeActive: state.scratchPaint.mode === Modes.SELECT,
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
        dispatch(changeMode(Modes.SELECT));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectMode);
