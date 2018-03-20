import React from 'react';
import PropTypes from 'prop-types';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import textIcon from './text.svg';
import styles from './text-mode.css';

const TextModeComponent = props => (
    <div>
        <ToolSelectComponent
            imgDescriptor={{
                defaultMessage: 'Text',
                description: 'Label for the text tool',
                id: 'paint.textMode.text'
            }}
            imgSrc={textIcon}
            isSelected={props.isSelected}
            onMouseDown={props.onMouseDown}
        />

        <textarea
            className={styles.textArea}
            ref={props.setTextArea}
        />
    </div>
);

TextModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    setTextArea: PropTypes.func.isRequired
};

export default TextModeComponent;
