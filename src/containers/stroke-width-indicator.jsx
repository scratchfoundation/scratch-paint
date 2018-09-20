import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {changeStrokeColor} from '../reducers/stroke-color';
import {changeStrokeWidth} from '../reducers/stroke-width';
import StrokeWidthIndicatorComponent from '../components/stroke-width-indicator.jsx';
import {applyStrokeColorToSelection, applyStrokeWidthToSelection} from '../helper/style-path';
import Modes from '../lib/modes';
import Formats from '../lib/format';
import {isBitmap} from '../lib/format';

class StrokeWidthIndicator extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChangeStrokeWidth'
        ]);
    }
    handleChangeStrokeWidth (newWidth) {
        let changed = false;
        if (this.props.strokeWidth === 0 && newWidth > 0) {
            changed = applyStrokeColorToSelection('#000', isBitmap(this.props.format), this.props.textEditTarget) ||
                changed;
            this.props.onChangeStrokeColor('#000');
        } else if (this.props.strokeWidth > 0 && newWidth === 0) {
            changed = applyStrokeColorToSelection(null, isBitmap(this.props.format), this.props.textEditTarget) ||
                changed;
            this.props.onChangeStrokeColor(null);
        }
        changed = applyStrokeWidthToSelection(newWidth, this.props.textEditTarget) || changed;
        this.props.onChangeStrokeWidth(newWidth);
        if (changed) this.props.onUpdateImage();
    }
    render () {
        return (
            <StrokeWidthIndicatorComponent
                disabled={this.props.disabled}
                strokeWidth={this.props.strokeWidth}
                onChangeStrokeWidth={this.handleChangeStrokeWidth}
            />
        );
    }
}

const mapStateToProps = state => ({
    disabled: state.scratchPaint.mode === Modes.BRUSH ||
        state.scratchPaint.mode === Modes.TEXT ||
        state.scratchPaint.mode === Modes.FILL,
    format: state.scratchPaint.format,
    strokeWidth: state.scratchPaint.color.strokeWidth,
    textEditTarget: state.scratchPaint.textEditTarget
});
const mapDispatchToProps = dispatch => ({
    onChangeStrokeColor: strokeColor => {
        dispatch(changeStrokeColor(strokeColor));
    },
    onChangeStrokeWidth: strokeWidth => {
        dispatch(changeStrokeWidth(strokeWidth));
    }
});

StrokeWidthIndicator.propTypes = {
    disabled: PropTypes.bool.isRequired,
    format: PropTypes.oneOf(Object.keys(Formats)),
    onChangeStrokeColor: PropTypes.func.isRequired,
    onChangeStrokeWidth: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    strokeWidth: PropTypes.number,
    textEditTarget: PropTypes.number
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StrokeWidthIndicator);
