import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {changeFillColor} from '../reducers/fill-color';
import {changeGradientType} from '../reducers/fill-mode-gradient-type';
import {openFillColor, closeFillColor} from '../reducers/modals';
import Modes from '../lib/modes';
import Formats from '../lib/format';
import {isBitmap} from '../lib/format';
import GradientTypes from '../lib/gradient-types';

import FillColorIndicatorComponent from '../components/fill-color-indicator.jsx';
import {applyFillColorToSelection, applyGradientTypeToSelection} from '../helper/style-path';

class FillColorIndicator extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChangeFillColor',
            'handleChangeGradientType',
            'handleCloseFillColor'
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
            isBitmap(this.props.format),
            this.props.textEditTarget);
        this._hasChanged = this._hasChanged || isDifferent;
        this.props.onChangeFillColor(newColor);
    }
    handleChangeGradientType (gradientType) {
        // Apply color and update redux, but do not update svg until picker closes.
        const isDifferent = applyGradientTypeToSelection(
            gradientType,
            isBitmap(this.props.format),
            this.props.textEditTarget);
        this._hasChanged = this._hasChanged || isDifferent;
        this.props.onChangeGradientType(gradientType);
    }
    handleCloseFillColor () {
        if (!this.props.isEyeDropping) {
            this.props.onCloseFillColor();
        }
    }
    render () {
        return (
            <FillColorIndicatorComponent
                {...this.props}
                onChangeFillColor={this.handleChangeFillColor}
                onChangeGradientType={this.handleChangeGradientType}
                onCloseFillColor={this.handleCloseFillColor}
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
    textEditTarget: state.scratchPaint.textEditTarget
});

const mapDispatchToProps = dispatch => ({
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor));
    },
    onOpenFillColor: () => {
        dispatch(openFillColor());
    },
    onCloseFillColor: () => {
        dispatch(closeFillColor());
    },
    onChangeGradientType: gradientType => {
        dispatch(changeGradientType(gradientType));
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
    onChangeFillColor: PropTypes.func.isRequired,
    onChangeGradientType: PropTypes.func.isRequired,
    onCloseFillColor: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    textEditTarget: PropTypes.number
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FillColorIndicator);
