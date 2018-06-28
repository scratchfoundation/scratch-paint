import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, intlShape} from 'react-intl';

import Button from '../button/button.jsx';

import styles from './tool-select-base.css';

const ToolSelectComponent = props => (
    <Button
        className={
            classNames(props.className, styles.modToolSelect, {
                [styles.isSelected]: props.isSelected
            })
        }
        disabled={props.disabled}
        title={props.intl.formatMessage(props.imgDescriptor)}
        onClick={props.onMouseDown}
    >
        <img
            alt={props.intl.formatMessage(props.imgDescriptor)}
            className={styles.toolSelectIcon}
            draggable={false}
            src={props.imgSrc}
        />
    </Button>
);

ToolSelectComponent.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    imgDescriptor: PropTypes.shape({
        defaultMessage: PropTypes.string,
        description: PropTypes.string,
        id: PropTypes.string
    }).isRequired,
    imgSrc: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default injectIntl(ToolSelectComponent);
