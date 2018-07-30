import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages} from 'react-intl';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import ovalIcon from './oval.svg';

const messages = defineMessages({
    oval: {
        defaultMessage: 'Circle',
        description: 'Label for the oval-drawing tool',
        id: 'paint.ovalMode.oval'
    }
}); 

const BitOvalComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.oval}
        imgSrc={ovalIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitOvalComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BitOvalComponent;
