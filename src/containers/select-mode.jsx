import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../modes/modes';
import {clearSelection} from '../reducers/selection';
import {setHoveredItem} from '../reducers/hover';
import {getHoveredItem} from '../helper/hover';
import {changeMode} from '../reducers/modes';
import SelectModeComponent from '../components/select-mode.jsx';
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
    getHitOptions () {
        this._hitOptions.tolerance = SelectMode.TOLERANCE / paper.view.zoom;
        return this._hitOptions;
    }
    activateTool () {
        clearSelection();
        this.preProcessSelection();
        this.tool = new paper.Tool();


        this.tool.onMouseDown = function (event) {
            this.onMouseDown(event);
        };

        this.tool.onMouseMove = function (event) {
            this.props.setHoveredItem(getHoveredItem(this.getHitOptions()));
        };

        
        this.tool.onMouseDrag = function (event) {
            this.onMouseDrag(event);
        };

        this.tool.onMouseUp = function (event) {
            this.onMouseUp(event);
        };
        this.tool.activate();
    }
    preProcessSelection () {
        // when switching to the select tool while having a child object of a
        // compound path selected, deselect the child and select the compound path
        // instead. (otherwise the compound path breaks because of scale-grouping)
        const items = this.props.selectedItems;
        for (let item of items) {
            if(isCompoundPathChild(item)) {
                var cp = getItemsCompoundPath(item);
                setItemSelection(item, false);
                setItemSelection(cp, true);
            }
        };
    };
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
    handleMouseDown: PropTypes.func.isRequired,
    isSelectModeActive: PropTypes.bool.isRequired,
    onUpdateSvg: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    isSelectModeActive: state.scratchPaint.mode === Modes.SELECT
});
const mapDispatchToProps = dispatch => ({
    setHoveredItem: hoveredItem => {
        dispatch(setHoveredItem(hoveredItem));
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.SELECT));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectMode);
