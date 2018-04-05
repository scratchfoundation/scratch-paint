import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';
import {MIXED} from '../helper/style-path';

import {changeFillColor, DEFAULT_COLOR} from '../reducers/fill-color';
import {changeBrushSize} from '../reducers/brush-mode';
import {changeMode} from '../reducers/modes';
import {clearSelectedItems} from '../reducers/selected-items';
import {clearSelection} from '../helper/selection';

import BitBrushModeComponent from '../components/bit-brush-mode/bit-brush-mode.jsx';
import BitBrushTool from '../helper/bit-tools/brush-tool';

class BitBrushMode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isBitBrushModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps (nextProps) {
        if (this.tool && nextProps.color !== this.props.color) {
            this.tool.setColor(nextProps.color);
        }
        
        if (nextProps.isBitBrushModeActive && !this.props.isBitBrushModeActive) {
            this.activateTool();
        } else if (!nextProps.isBitBrushModeActive && this.props.isBitBrushModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps) {
        return nextProps.isBrushModeActive !== this.props.isBitBrushModeActive;
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);
        // Force the default brush color if fill is MIXED or transparent
        let color = this.props.color;
        if (color === MIXED || color === null) {
            this.props.onChangeFillColor(DEFAULT_COLOR);
            color = DEFAULT_COLOR;
        }
        this.tool = new BitBrushTool(
            this.props.onUpdateSvg
        );
        this.tool.setColor(color);

        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <BitBrushModeComponent
                isSelected={this.props.isBitBrushModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

BitBrushMode.propTypes = {
    bitBrushModeState: PropTypes.shape({
        brushSize: PropTypes.number.isRequired
    }),
    clearSelectedItems: PropTypes.func.isRequired,
    color: PropTypes.string,
    handleMouseDown: PropTypes.func.isRequired,
    isBitBrushModeActive: PropTypes.bool.isRequired,
    onChangeFillColor: PropTypes.func.isRequired,
    onUpdateSvg: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    brushModeState: state.scratchPaint.brushMode,
    color: state.scratchPaint.color.fillColor,
    isBitBrushModeActive: state.scratchPaint.mode === Modes.BIT_BRUSH
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    changeBrushSize: brushSize => {
        dispatch(changeBrushSize(brushSize));
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.BIT_BRUSH));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BitBrushMode);
