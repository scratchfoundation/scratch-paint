import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';

import {changeColorIndex} from '../reducers/color-index';
import {changeFillColor} from '../reducers/fill-color';
import {changeFillColor2} from '../reducers/fill-color-2';
import {changeGradientType} from '../reducers/fill-mode-gradient-type';
import {openFillColor, closeFillColor} from '../reducers/modals';
import {getSelectedLeafItems} from '../helper/selection';
import {setSelectedItems} from '../reducers/selected-items';
import Modes from '../lib/modes';
import Formats from '../lib/format';
import {isBitmap, isVector} from '../lib/format';
import GradientTypes from '../lib/gradient-types';

import FillColorIndicatorComponent from '../components/fill-color-indicator.jsx';
import {applyFillColorToSelection, applyGradientTypeToSelection, swapColorsInSelection} from '../helper/style-path';

class FillColorIndicator extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChangeFillColor',
            'handleChangeGradientType',
            'handleCloseFillColor',
            'handleSwap'
        ]);

        // Flag to track whether an svg-update-worthy change has been made
        this._hasChanged = false;
    }
    componentWillReceiveProps (newProps) {
        const {fillColorModalVisible, onUpdateImage} = this.props;
        if (fillColorModalVisible && !newProps.fillColorModalVisible) {
            // Submit the new SVG, which also stores a single undo/redo action.
            if (this._hasChanged) onUpdateImage();
            this._hasChanged = false;
        }
    }
    handleChangeFillColor (newColor) {
        // Apply color and update redux, but do not update svg until picker closes.
        const isDifferent = applyFillColorToSelection(
            newColor,
            this.props.colorIndex,
            this.props.gradientType === GradientTypes.SOLID,
            isBitmap(this.props.format),
            this.props.textEditTarget);
        this._hasChanged = this._hasChanged || isDifferent;
        this.props.onChangeFillColor(newColor, this.props.colorIndex);
    }
    handleChangeGradientType (gradientType) {
        // Apply color and update redux, but do not update svg until picker closes.
        const isDifferent = applyGradientTypeToSelection(
            gradientType,
            this.props.fillColor2,
            isBitmap(this.props.format),
            this.props.textEditTarget);
        this._hasChanged = this._hasChanged || isDifferent;
        this.props.onChangeGradientType(gradientType);
    }
    handleCloseFillColor () {
        if (!this.props.isEyeDropping) {
            this.props.onCloseFillColor();
        }
        this.props.onChangeColorIndex(0);
    }
    handleSwap () {
        swapColorsInSelection(
            isBitmap(this.props.format),
            this.props.textEditTarget);
        this.props.setSelectedItems();
    }
    render () {
        return (
            <FillColorIndicatorComponent
                {...this.props}
                onChangeFillColor={this.handleChangeFillColor}
                onChangeGradientType={this.handleChangeGradientType}
                onCloseFillColor={this.handleCloseFillColor}
                onSwap={this.handleSwap}
            />
        );
    }
}

const mapStateToProps = state => ({
    colorIndex: state.scratchPaint.fillMode.colorIndex,
    disabled: state.scratchPaint.mode === Modes.LINE,
    fillColor: state.scratchPaint.color.fillColor,
    fillColor2: state.scratchPaint.color.fillColor2,
    fillColorModalVisible: state.scratchPaint.modals.fillColor,
    format: state.scratchPaint.format,
    gradientType: state.scratchPaint.color.gradientType,
    isEyeDropping: state.scratchPaint.color.eyeDropper.active,
    mode: state.scratchPaint.mode,
    shouldShowGradientTools: isVector(state.scratchPaint.format) &&
        (state.scratchPaint.mode === Modes.SELECT ||
        state.scratchPaint.mode === Modes.RESHAPE ||
        state.scratchPaint.mode === Modes.FILL),
    textEditTarget: state.scratchPaint.textEditTarget
});

const mapDispatchToProps = dispatch => ({
    onChangeColorIndex: index => {
        dispatch(changeColorIndex(index));
    },
    onChangeFillColor: (fillColor, index) => {
        if (index === 0) {
            dispatch(changeFillColor(fillColor));
        } else if (index === 1) {
            dispatch(changeFillColor2(fillColor));
        }
    },
    onOpenFillColor: () => {
        dispatch(openFillColor());
    },
    onCloseFillColor: () => {
        dispatch(closeFillColor());
    },
    onChangeGradientType: gradientType => {
        dispatch(changeGradientType(gradientType));
    },
    setSelectedItems: format => {
        dispatch(setSelectedItems(getSelectedLeafItems(), isBitmap(format)));
    }
});

FillColorIndicator.propTypes = {
    colorIndex: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    fillColor: PropTypes.string,
    fillColor2: PropTypes.string,
    fillColorModalVisible: PropTypes.bool.isRequired,
    format: PropTypes.oneOf(Object.keys(Formats)),
    gradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired,
    isEyeDropping: PropTypes.bool.isRequired,
    onChangeColorIndex: PropTypes.func.isRequired,
    onChangeFillColor: PropTypes.func.isRequired,
    onChangeGradientType: PropTypes.func.isRequired,
    onCloseFillColor: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    setSelectedItems: PropTypes.func.isRequired,
    textEditTarget: PropTypes.number
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FillColorIndicator);
