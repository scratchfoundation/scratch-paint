import React from 'react';
import PropTypes from 'prop-types';

import {MIXED} from '../../helper/style-path';

import noFillIcon from './no-fill.svg';
import mixedFillIcon from './mixed-fill.svg';
import styles from './color-button.css';

const colorToBackground = (color) => {
    return color === MIXED || color === null ? 'white' : color
};

const ColorButtonComponent = props => (
    <div
        className={styles.colorButton}
        onClick={props.onClick}
    >
        <div
            className={styles.colorButtonSwatch}
            style={{
                background: colorToBackground(props.color)
            }}
        >
            {props.color === null ? (
                <img
                    className={styles.swatchIcon}
                    src={noFillIcon}
                />
            ) : ((props.color === MIXED ? (
                <img
                    className={styles.swatchIcon}
                    src={mixedFillIcon}
                />
            ) : null))}
        </div>
        <div className={styles.colorButtonArrow}>▾</div>
    </div>
);

ColorButtonComponent.propTypes = {
    color: PropTypes.string,
    onClick: PropTypes.func.isRequired
};

export default ColorButtonComponent;
