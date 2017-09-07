import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {changeFillColor} from '../reducers/fill-color';
import FillColorIndicatorComponent from '../components/fill-color-indicator.jsx';

const FillColorIndicator = props => (
    <FillColorIndicatorComponent
        fillColor={props.fillColor}
        onChangeFillColor={props.handleChangeFillColor}
    />
);

FillColorIndicator.propTypes = {
    fillColor: PropTypes.string.isRequired,
    handleChangeFillColor: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    fillColor: state.scratchPaint.fillColor
});
const mapDispatchToProps = dispatch => ({
    handleChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FillColorIndicator);
