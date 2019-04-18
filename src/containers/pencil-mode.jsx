import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';

import {changeStrokeColor} from '../reducers/stroke-color';
import {changeMode} from '../reducers/modes';
import {clearSelectedItems} from '../reducers/selected-items';
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
        if (this.tool && nextProps.pencilModeState.pencilSmoothing !== this.props.pencilModeState.pencilSmoothing) {
            this.tool.setSmoothing(nextProps.pencilModeState.pencilSmoothing);
        }

        if (nextProps.isPencilModeActive && !this.props.isPencilModeActive) {
            this.activateTool();
        } else if (!nextProps.isPencilModeActive && this.props.isPencilModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps) {
        return nextProps.isPencilModeActive !== this.props.isPencilModeActive;
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);

        this.tool = new PencilTool(
            this.props.clearSelectedItems,
            this.props.onUpdateImage
        );
        this.tool.setColorState(this.props.colorState);
        this.tool.setSmoothing(this.props.pencilModeState.pencilSmoothing);
        this.tool.activate();
    }
    deactivateTool () {
        this.tool.remove();
        this.tool = null;
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
    clearSelectedItems: PropTypes.func.isRequired,
    colorState: PropTypes.shape({
        fillColor: PropTypes.string,
        strokeColor: PropTypes.string,
        strokeWidth: PropTypes.number
    }).isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    isPencilModeActive: PropTypes.bool.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    pencilModeState: PropTypes.shape({
        pencilSmoothing: PropTypes.number.isRequired
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
