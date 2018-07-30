import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages} from 'react-intl';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import selectIcon from './marquee.svg';

const messages = defineMessages({
    select: {
        defaultMessage: 'Select',
        description: 'Label for the select tool, which allows selecting, moving, and resizing shapes',
        id: 'paint.selectMode.select'
    }
}); 

const BitSelectComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.select}
        imgSrc={selectIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitSelectComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BitSelectComponent;
