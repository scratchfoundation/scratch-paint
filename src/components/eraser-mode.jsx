import React from 'react';
import PropTypes from 'prop-types';

const EraserModeComponent = props => (
    <button onClick={props.onMouseDown}>Eraser</button>
);

EraserModeComponent.propTypes = {
    onMouseDown: PropTypes.func.isRequired
};

export default EraserModeComponent;
