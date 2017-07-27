import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import ToolTypes from '../../tools/tool-types.js';
import BlobTool from '../../tools/blob.js';
import EraserToolReducer from '../../reducers/eraser-tool';
import paper from 'paper';

class EraserTool extends React.Component {
    static get TOOL_TYPE () {
        return ToolTypes.ERASER;
    }
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool',
            'onScroll'
        ]);
        this.blob = new BlobTool();
    }
    componentDidMount () {
        if (this.props.tool === EraserTool.TOOL_TYPE) {
            this.activateTool();
        }
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.tool === EraserTool.TOOL_TYPE && this.props.tool !== EraserTool.TOOL_TYPE) {
            this.activateTool();
        } else if (nextProps.tool !== EraserTool.TOOL_TYPE && this.props.tool === EraserTool.TOOL_TYPE) {
            this.deactivateTool();
        } else if (nextProps.tool === EraserTool.TOOL_TYPE && this.props.tool === EraserTool.TOOL_TYPE) {
            this.blob.setOptions(nextProps.eraserToolState);
        }
    }
    shouldComponentUpdate () {
        return false; // Logic only component
    }
    activateTool () {
        this.props.canvas.addEventListener('mousewheel', this.onScroll);

        this.tool = new paper.Tool();
        this.blob.activateTool(true /* isEraser */, this.tool, this.props.eraserToolState);
        this.tool.activate();
    }
    deactivateTool () {
        this.props.canvas.removeEventListener('mousewheel', this.onScroll);
        this.blob.deactivateTool();
    }
    onScroll (event) {
        event.preventDefault();
        if (event.deltaY < 0) {
            this.props.changeBrushSize(this.props.eraserToolState.brushSize + 1);
        } else if (event.deltaY > 0 && this.props.eraserToolState.brushSize > 1) {
            this.props.changeBrushSize(this.props.eraserToolState.brushSize - 1);
        }
    }
    render () {
        return (
            <div>Eraser Tool</div>
        );
    }
}

EraserTool.propTypes = {
    canvas: PropTypes.instanceOf(Element).isRequired,
    changeBrushSize: PropTypes.func.isRequired,
    eraserToolState: PropTypes.shape({
        brushSize: PropTypes.number.isRequired
    }),
    tool: PropTypes.oneOf(Object.keys(ToolTypes)).isRequired
};

const mapStateToProps = state => ({
    eraserToolState: state.eraserTool,
    tool: state.tool
});
const mapDispatchToProps = dispatch => ({
    changeBrushSize: brushSize => {
        dispatch(EraserToolReducer.changeBrushSize(brushSize));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EraserTool);
