import React from 'react';
import PropTypes from 'prop-types';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import fillIcon from './fill.svg';

const FillModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={{
            defaultMessage: 'Fill',
            description: 'Label for the fill tool',
            id: 'paint.fillMode.fill'
        }}
        imgSrc={fillIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

FillModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default FillModeComponent;
