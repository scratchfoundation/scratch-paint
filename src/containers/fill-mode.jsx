import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';
import GradientTypes from '../lib/gradient-types';
import FillTool from '../helper/tools/fill-tool';
import {MIXED} from '../helper/style-path';

import {changeFillColor, DEFAULT_COLOR} from '../reducers/fill-color';
import {changeMode} from '../reducers/modes';
import {clearSelectedItems} from '../reducers/selected-items';
import {clearSelection} from '../helper/selection';
import {clearHoveredItem, setHoveredItem} from '../reducers/hover';
import {changeGradientType} from '../reducers/fill-mode-gradient-type';

import FillModeComponent from '../components/fill-mode/fill-mode.jsx';

class FillMode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isFillModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps (nextProps) {
        if (this.tool && nextProps.fillColor !== this.props.fillColor) {
            this.tool.setFillColor(nextProps.fillColor);
        }
        if (this.tool && nextProps.hoveredItemId !== this.props.hoveredItemId) {
            this.tool.setPrevHoveredItemId(nextProps.hoveredItemId);
        }
        if (this.tool && nextProps.fillModeGradientType !== this.props.fillModeGradientType) {
            this.tool.setGradientType(nextProps.fillModeGradientType);
        }

        if (nextProps.isFillModeActive && !this.props.isFillModeActive) {
            this.activateTool();
        } else if (!nextProps.isFillModeActive && this.props.isFillModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps) {
        return nextProps.isFillModeActive !== this.props.isFillModeActive;
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);
        // Force the default fill color if fill is MIXED
        if (this.props.fillColor === MIXED) {
            this.props.onChangeFillColor(DEFAULT_COLOR);
        }
        this.props.changeGradientType(this.props.fillModeGradientType);
        this.tool = new FillTool(
            this.props.setHoveredItem,
            this.props.clearHoveredItem,
            this.props.onUpdateImage
        );
        this.tool.setFillColor(this.props.fillColor === MIXED ? DEFAULT_COLOR : this.props.fillColor);
        this.tool.setGradientType(this.props.fillModeGradientType);
        this.tool.setPrevHoveredItemId(this.props.hoveredItemId);
        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <FillModeComponent
                isSelected={this.props.isFillModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

FillMode.propTypes = {
    changeGradientType: PropTypes.func.isRequired,
    clearHoveredItem: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    fillColor: PropTypes.string,
    fillModeGradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    hoveredItemId: PropTypes.number,
    isFillModeActive: PropTypes.bool.isRequired,
    onChangeFillColor: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    setHoveredItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    fillModeGradientType: state.scratchPaint.fillMode.gradientType,
    fillColor: state.scratchPaint.color.fillColor,
    hoveredItemId: state.scratchPaint.hoveredItemId,
    isFillModeActive: state.scratchPaint.mode === Modes.FILL
});
const mapDispatchToProps = dispatch => ({
    setHoveredItem: hoveredItemId => {
        dispatch(setHoveredItem(hoveredItemId));
    },
    clearHoveredItem: () => {
        dispatch(clearHoveredItem());
    },
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    changeGradientType: gradientType => {
        dispatch(changeGradientType(gradientType));
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.FILL));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FillMode);
