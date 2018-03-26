import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {changeStrokeColor} from '../reducers/stroke-color';
import {openStrokeColor, closeStrokeColor} from '../reducers/modals';
import Modes from '../lib/modes';

import StrokeColorIndicatorComponent from '../components/stroke-color-indicator.jsx';
import {applyStrokeColorToSelection} from '../helper/style-path';

class StrokeColorIndicator extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChangeStrokeColor',
            'handleCloseStrokeColor'
        ]);

        // Flag to track whether an svg-update-worthy change has been made
        this._hasChanged = false;
    }
    componentWillReceiveProps (newProps) {
        const {strokeColorModalVisible, onUpdateSvg} = this.props;
        if (strokeColorModalVisible && !newProps.strokeColorModalVisible) {
            // Submit the new SVG, which also stores a single undo/redo action.
            if (this._hasChanged) onUpdateSvg();
            this._hasChanged = false;
        }
    }
    handleChangeStrokeColor (newColor) {
        // Apply color and update redux, but do not update svg until picker closes.
        const isDifferent = applyStrokeColorToSelection(newColor, this.props.textEditTarget);
        this._hasChanged = this._hasChanged || isDifferent;
        this.props.onChangeStrokeColor(newColor);
    }
    handleCloseStrokeColor () {
        if (!this.props.isEyeDropping) {
            this.props.onCloseStrokeColor();
        }
    }
    render () {
        return (
            <StrokeColorIndicatorComponent
                {...this.props}
                onChangeStrokeColor={this.handleChangeStrokeColor}
                onCloseStrokeColor={this.handleCloseStrokeColor}
            />
        );
    }
}

const mapStateToProps = state => ({
    disabled: state.scratchPaint.mode === Modes.BRUSH ||
        state.scratchPaint.mode === Modes.TEXT,
    isEyeDropping: state.scratchPaint.color.eyeDropper.active,
    strokeColor: state.scratchPaint.color.strokeColor,
    strokeColorModalVisible: state.scratchPaint.modals.strokeColor,
    textEditTarget: state.scratchPaint.textEditTarget
});

const mapDispatchToProps = dispatch => ({
    onChangeStrokeColor: strokeColor => {
        dispatch(changeStrokeColor(strokeColor));
    },
    onOpenStrokeColor: () => {
        dispatch(openStrokeColor());
    },
    onCloseStrokeColor: () => {
        dispatch(closeStrokeColor());
    }
});

StrokeColorIndicator.propTypes = {
    disabled: PropTypes.bool.isRequired,
    isEyeDropping: PropTypes.bool.isRequired,
    onChangeStrokeColor: PropTypes.func.isRequired,
    onCloseStrokeColor: PropTypes.func.isRequired,
    onUpdateSvg: PropTypes.func.isRequired,
    strokeColor: PropTypes.string,
    strokeColorModalVisible: PropTypes.bool.isRequired,
    textEditTarget: PropTypes.number
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StrokeColorIndicator);
