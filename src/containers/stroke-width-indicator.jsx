import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {changeStrokeWidth} from '../reducers/stroke-width';
import StrokeWidthIndicatorComponent from '../components/stroke-width-indicator.jsx';

const StrokeWidthIndicator = props => (
    <StrokeWidthIndicatorComponent
        strokeWidth={props.strokeWidth}
        onChangeStrokeWidth={props.handleChangeStrokeWidth}
    />
);

StrokeWidthIndicator.propTypes = {
    handleChangeStrokeWidth: PropTypes.func.isRequired,
    strokeWidth: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    strokeWidth: state.scratchPaint.color.strokeWidth
});
const mapDispatchToProps = dispatch => ({
    handleChangeStrokeWidth: strokeWidth => {
        dispatch(changeStrokeWidth(strokeWidth));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StrokeWidthIndicator);
