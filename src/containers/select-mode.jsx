import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../modes/modes';

import {changeMode} from '../reducers/modes';
import {setHoveredItem, clearHoveredItem} from '../reducers/hover';

import {getHoveredItem} from '../helper/hover';
import {rectSelect} from '../helper/guides';
import {clearSelection, selectRootItem, processRectangularSelection} from '../helper/selection';

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
            'getHitOptions',
            'preProcessSelection',
            'onMouseDown',
            'onMouseMove',
            'onMouseDrag',
            'onMouseUp'
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
        clearSelection();
        selectRootItem();
        this.tool = new paper.Tool();


        this.tool.onMouseDown = function (event) {
            if (event.event.button > 0) return;  // only first mouse button
            this.props.clearHoveredItem();
            if (!this.boundingBoxTool.onMouseDown(
                    event, event.modifiers.alt, event.modifiers.shift, true /* preselectedOnly */)) {
                this.selectionBoxMode = true;
            }
        };

        this.tool.onMouseMove = function (event) {
            this.props.setHoveredItem(getHoveredItem(event, this.getHitOptions()));
        };

        
        this.tool.onMouseDrag = function (event) {
            if (event.event.button > 0) return;  // only first mouse button
            if (this.selectionBoxMode) {
                this.selectionRect = rectSelect(event);
                // Remove this rect on the next drag and up event
                this.selectionRect.removeOnDrag();
            } else {
                this.boundingBoxTool.onMouseDrag(event);
            }
        };

        this.tool.onMouseUp = function (event) {
            if (event.event.button > 0) return;  // only first mouse button
            if (this.selectionBoxMode) {
                processRectangularSelection(event, this.selectionRect);
                this.selectionRect.remove();
            } else {
                this.boundingBoxTool.onMouseUp(event);
                this.props.onUpdateSvg();
            }
            this.selectionBoxMode = false;
            this.selectionRect = null;
        };
        this.tool.activate();
    }
    deactivateTool () {
        this.props.setHoveredItem();
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
    isSelectModeActive: PropTypes.bool.isRequired,
    onUpdateSvg: PropTypes.func.isRequired,
    setHoveredItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    isSelectModeActive: state.scratchPaint.mode === Modes.SELECT
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
