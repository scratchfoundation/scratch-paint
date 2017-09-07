import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {changeStrokeColor} from '../reducers/stroke-color';
import StrokeColorIndicatorComponent from '../components/stroke-color-indicator.jsx';

const StrokeColorIndicator = props => (
    <StrokeColorIndicatorComponent
        strokeColor={props.strokeColor}
        onChangeStrokeColor={props.handleChangeStrokeColor}
    />
);

StrokeColorIndicator.propTypes = {
    handleChangeStrokeColor: PropTypes.func.isRequired,
    strokeColor: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    strokeColor: state.scratchPaint.color.strokeColor
});
const mapDispatchToProps = dispatch => ({
    handleChangeStrokeColor: strokeColor => {
        dispatch(changeStrokeColor(strokeColor));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StrokeColorIndicator);
