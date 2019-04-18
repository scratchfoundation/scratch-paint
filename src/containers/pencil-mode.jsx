import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';
import {MIXED} from '../helper/style-path';

import {changeStrokeColor, DEFAULT_COLOR} from '../reducers/stroke-color';
import {changeMode} from '../reducers/modes';
import {clearSelectedItems} from '../reducers/selected-items';
import {clearGradient} from '../reducers/selection-gradient-type';
import {clearSelection} from '../helper/selection';

import PencilTool from '../helper/tools/pencil-tool';
import PencilModeComponent from '../components/pencil-mode/pencil-mode.jsx';

class PencilMode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isPencilModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps (nextProps) {
        if (this.tool && nextProps.colorState !== this.props.colorState) {
            this.tool.setColorState(nextProps.colorState);
        }

        if (nextProps.isPencilModeActive && !this.props.isPencilModeActive) {
            this.activateTool();
        } else if (!nextProps.isPencilModeActive && this.props.isPencilModeActive) {
            this.deactivateTool();
        } else if (nextProps.isPencilModeActive && this.props.isPencilModeActive) {
            // TODO
        }
    }
    shouldComponentUpdate (nextProps) {
        return nextProps.isPencilModeActive !== this.props.isPencilModeActive;
    }
    componentWillUnmount () {
        // TODO
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);
        this.props.clearGradient();

        this.tool = new PencilTool(
            this.props.clearSelectedItems,
            this.props.onUpdateImage
        );
        this.tool.setColorState(this.props.colorState);
        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;

        console.log("DEACTIVATED");
    }
    render () {
        return (
            <PencilModeComponent
                isSelected={this.props.isPencilModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

PencilMode.propTypes = {
    clearGradient: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    colorState: PropTypes.shape({
        fillColor: PropTypes.string,
        strokeColor: PropTypes.string,
        strokeWidth: PropTypes.number
    }).isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    isPencilModeActive: PropTypes.bool.isRequired,
    onChangeStrokeColor: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    pencilModeState: PropTypes.shape({
        brushSize: PropTypes.number.isRequired
    })
};

const mapStateToProps = state => ({
    pencilModeState: state.scratchPaint.pencilMode,
    colorState: state.scratchPaint.color,
    isPencilModeActive: state.scratchPaint.mode === Modes.PENCIL
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    clearGradient: () => {
        dispatch(clearGradient());
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.PENCIL));
    },
    onChangeStrokeColor: strokeColor => {
        dispatch(changeStrokeColor(strokeColor));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PencilMode);
