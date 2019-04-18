import React from 'react';
import PropTypes from 'prop-types';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import messages from '../../lib/messages.js';
import pencilIcon from './pencil.svg';

const PencilModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.pencil}
        imgSrc={pencilIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

PencilModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default PencilModeComponent;
