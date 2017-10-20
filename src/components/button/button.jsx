/* DO NOT EDIT
@todo This file is copied from GUI and should be pulled out into a shared library.
See #13 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './button.css';

const ButtonComponent = ({
    className,
    onClick,
    children,
    ...props
}) => (
    <span
        className={classNames(
            styles.button,
            className
        )}
        role="button"
        onClick={onClick}
        {...props}
    >
        {children}
    </span>
);

ButtonComponent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired
};
export default ButtonComponent;
