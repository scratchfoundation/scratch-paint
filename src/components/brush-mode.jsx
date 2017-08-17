import React from 'react';
import PropTypes from 'prop-types';

const BrushModeComponent = props => (
    <button onClick={props.onMouseDown}>Brush</button>
);

BrushModeComponent.propTypes = {
    onMouseDown: PropTypes.func.isRequired
};

export default BrushModeComponent;
