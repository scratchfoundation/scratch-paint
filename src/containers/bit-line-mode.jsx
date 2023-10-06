import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';
import {MIXED} from '../helper/style-path';

import {changeFillColor, clearFillGradient, DEFAULT_COLOR} from '../reducers/fill-style';
import {changeMode} from '../reducers/modes';
import {clearSelectedItems} from '../reducers/selected-items';
import {clearSelection} from '../helper/selection';

import BitLineModeComponent from '../components/bit-line-mode/bit-line-mode.jsx';
import BitLineTool from '../helper/bit-tools/line-tool';

class BitLineMode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isBitLineModeActive) {
            this.activateTool(this.props);
        }
    }
    componentDidUpdate (prevProps) {
        if (this.tool && this.props.color !== prevProps.color) {
            this.tool.setColor(this.props.color);
        }
        if (this.tool && this.props.bitBrushSize !== prevProps.bitBrushSize) {
            this.tool.setLineSize(this.props.bitBrushSize);
        }

        if (this.props.isBitLineModeActive && !prevProps.isBitLineModeActive) {
            this.activateTool();
        } else if (!this.props.isBitLineModeActive && prevProps.isBitLineModeActive) {
            this.deactivateTool();
        }
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);
        this.props.clearGradient();
        // Force the default line color if fill is MIXED or transparent
        let color = this.props.color;
        if (!color || color === MIXED) {
            this.props.onChangeFillColor(DEFAULT_COLOR);
            color = DEFAULT_COLOR;
        }
        this.tool = new BitLineTool(
            this.props.onUpdateImage
        );
        this.tool.setColor(color);
        this.tool.setLineSize(this.props.bitBrushSize);

        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <BitLineModeComponent
                isSelected={this.props.isBitLineModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

BitLineMode.propTypes = {
    bitBrushSize: PropTypes.number.isRequired,
    clearGradient: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    color: PropTypes.string,
    handleMouseDown: PropTypes.func.isRequired,
    isBitLineModeActive: PropTypes.bool.isRequired,
    onChangeFillColor: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    bitBrushSize: state.scratchPaint.bitBrushSize,
    color: state.scratchPaint.color.fillColor.primary,
    isBitLineModeActive: state.scratchPaint.mode === Modes.BIT_LINE
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    clearGradient: () => {
        dispatch(clearFillGradient());
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.BIT_LINE));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BitLineMode);
