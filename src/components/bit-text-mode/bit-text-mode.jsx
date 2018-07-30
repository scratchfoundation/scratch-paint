import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages} from 'react-intl';

import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import textIcon from './text.svg';

const messages = defineMessages({
    text: {
        defaultMessage: 'Text',
        description: 'Label for the text tool',
        id: 'paint.textMode.text'
    }
}); 

const BitTextComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.text}
        imgSrc={textIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitTextComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BitTextComponent;
