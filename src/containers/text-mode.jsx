import paper from '@scratch/paper';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Fonts from '../lib/fonts';
import Modes from '../lib/modes';
import {MIXED} from '../helper/style-path';

import {changeFont} from '../reducers/font';
import {changeFillColor, DEFAULT_COLOR} from '../reducers/fill-color';
import {changeStrokeColor} from '../reducers/stroke-color';
import {changeMode} from '../reducers/modes';
import {setTextEditTarget} from '../reducers/text-edit-target';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items';

import {clearSelection, getSelectedLeafItems} from '../helper/selection';
import TextTool from '../helper/tools/text-tool';
import TextModeComponent from '../components/text-mode/text-mode.jsx';

class TextMode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isTextModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps (nextProps) {
        if (this.tool && nextProps.colorState !== this.props.colorState) {
            this.tool.setColorState(nextProps.colorState);
        }
        if (this.tool && nextProps.selectedItems !== this.props.selectedItems) {
            this.tool.onSelectionChanged(nextProps.selectedItems);
        }
        if (this.tool && !nextProps.textEditTarget && this.props.textEditTarget) {
            this.tool.onTextEditCancelled();
        }
        if (this.tool && !nextProps.viewBounds.equals(this.props.viewBounds)) {
            this.tool.onViewBoundsChanged(nextProps.viewBounds);
        }
        if (this.tool && nextProps.font !== this.props.font) {
            this.tool.setFont(nextProps.font);
        }

        if (nextProps.isTextModeActive && !this.props.isTextModeActive) {
            this.activateTool();
        } else if (!nextProps.isTextModeActive && this.props.isTextModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps) {
        return nextProps.isTextModeActive !== this.props.isTextModeActive;
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);
        
        // If fill and stroke color are both mixed/transparent/absent, set fill to default and stroke to transparent.
        // If exactly one of fill or stroke color is set, set the other one to transparent.
        // This way the tool won't draw an invisible state, or be unclear about what will be drawn.
        const {fillColor, strokeColor, strokeWidth} = this.props.colorState;
        const fillColorPresent = fillColor !== MIXED && fillColor !== null;
        const strokeColorPresent =
            strokeColor !== MIXED && strokeColor !== null && strokeWidth !== null && strokeWidth !== 0;
        if (!fillColorPresent && !strokeColorPresent) {
            this.props.onChangeFillColor(DEFAULT_COLOR);
            this.props.onChangeStrokeColor(null);
        } else if (!fillColorPresent && strokeColorPresent) {
            this.props.onChangeFillColor(null);
        } else if (fillColorPresent && !strokeColorPresent) {
            this.props.onChangeStrokeColor(null);
        }
        if (!this.props.font || Object.keys(Fonts).map(key => Fonts[key])
            .indexOf(this.props.font) < 0) {
            this.props.changeFont(Fonts.SANS_SERIF);
        }

        this.tool = new TextTool(
            this.props.textArea,
            this.props.setSelectedItems,
            this.props.clearSelectedItems,
            this.props.onUpdateImage,
            this.props.setTextEditTarget,
            this.props.changeFont
        );
        this.tool.setColorState(this.props.colorState);
        this.tool.setFont(this.props.font);
        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <TextModeComponent
                isSelected={this.props.isTextModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

TextMode.propTypes = {
    changeFont: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    colorState: PropTypes.shape({
        fillColor: PropTypes.string,
        strokeColor: PropTypes.string,
        strokeWidth: PropTypes.number
    }).isRequired,
    font: PropTypes.string,
    handleMouseDown: PropTypes.func.isRequired,
    isTextModeActive: PropTypes.bool.isRequired,
    onChangeFillColor: PropTypes.func.isRequired,
    onChangeStrokeColor: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.instanceOf(paper.Item)),
    setSelectedItems: PropTypes.func.isRequired,
    setTextEditTarget: PropTypes.func.isRequired,
    textArea: PropTypes.instanceOf(Element),
    textEditTarget: PropTypes.number,
    viewBounds: PropTypes.instanceOf(paper.Matrix).isRequired
};

const mapStateToProps = state => ({
    colorState: state.scratchPaint.color,
    font: state.scratchPaint.font,
    isTextModeActive: state.scratchPaint.mode === Modes.TEXT,
    selectedItems: state.scratchPaint.selectedItems,
    textEditTarget: state.scratchPaint.textEditTarget,
    viewBounds: state.scratchPaint.viewBounds
});
const mapDispatchToProps = dispatch => ({
    changeFont: font => {
        dispatch(changeFont(font));
    },
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    setSelectedItems: () => {
        dispatch(setSelectedItems(getSelectedLeafItems()));
    },
    setTextEditTarget: targetId => {
        dispatch(setTextEditTarget(targetId));
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.TEXT));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor));
    },
    onChangeStrokeColor: strokeColor => {
        dispatch(changeStrokeColor(strokeColor));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TextMode);
