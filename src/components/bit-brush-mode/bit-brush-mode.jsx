import React from 'react';
import PropTypes from 'prop-types';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import {defineMessages} from 'react-intl';

import brushIcon from './brush.svg';

const messages = defineMessages({
    brush: {
        defaultMessage: 'Brush',
        description: 'Label for the brush tool',
        id: 'paint.brushMode.brush'
    }
});

const BitBrushModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.brush}
        imgSrc={brushIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitBrushModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BitBrushModeComponent;
