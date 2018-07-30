import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages} from 'react-intl';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import brushIcon from './brush.svg';

const messages = defineMessages({
    brush: {
        defaultMessage: 'Brush',
        description: 'Label for the brush tool',
        id: 'paint.brushMode.brush'
    }
}); 

const BrushModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.brush}
        imgSrc={brushIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BrushModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BrushModeComponent;
