import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages} from 'react-intl';

import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import rectIcon from './rectangle.svg';

const messages = defineMessages({
    rect: {
        defaultMessage: 'Rectangle',
        description: 'Label for the rectangle tool',
        id: 'paint.rectMode.rect'
    }
});

const BitRectComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.rect}
        imgSrc={rectIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitRectComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BitRectComponent;
