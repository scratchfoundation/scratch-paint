import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {MIXED} from '../../helper/style-path';

import noFillIcon from './no-fill.svg';
import mixedFillIcon from './mixed-fill.svg';
import styles from './color-button.css';
import GradientTypes from '../../lib/gradient-types';
import log from '../../log/log';
import ColorProptype from '../../lib/color-proptype';

const colorToBackground = (color, color2, gradientType) => {
    if (color === MIXED || (gradientType !== GradientTypes.SOLID && color2 === MIXED)) return 'white';

    color = (color === null) ? 'white' : color.toCSS();
    color2 = (color2 === null || color2 === MIXED) ? 'white' : color2.toCSS();

    switch (gradientType) {
    case GradientTypes.SOLID: return color;
    case GradientTypes.HORIZONTAL: return `linear-gradient(to right, ${color}, ${color2})`;
    case GradientTypes.VERTICAL: return `linear-gradient(${color}, ${color2})`;
    case GradientTypes.RADIAL: return `radial-gradient(${color}, ${color2})`;
    default: log.error(`Unrecognized gradient type: ${gradientType}`);
    }
};

/*
 * The square of color on the color indicator that shows the currently selected color. It may be
 * a solid color, a gradient, or an icon with a white background to indicate transparent.
 */
const ColorButtonComponent = props => (
    <div
        className={styles.colorButton}
        onClick={props.onClick}
    >
        <div
            className={classNames(styles.colorButtonSwatch, {
                [styles.outlineSwatch]: props.outline && !(props.color === MIXED)
            })}
            style={{
                background: colorToBackground(props.color, props.color2, props.gradientType)
            }}
        >
            {props.color === null && (props.gradientType === GradientTypes.SOLID || props.color2 === null) ? (
                <img
                    className={styles.swatchIcon}
                    draggable={false}
                    src={noFillIcon}
                />
            ) : ((props.color === MIXED || (props.gradientType !== GradientTypes.SOLID && props.color2 === MIXED) ? (
                <img
                    className={styles.swatchIcon}
                    draggable={false}
                    src={mixedFillIcon}
                />
            ) : null))}
        </div>
        <div className={styles.colorButtonArrow}>▾</div>
    </div>
);

ColorButtonComponent.propTypes = {
    color: ColorProptype,
    color2: ColorProptype,
    gradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired,
    onClick: PropTypes.func.isRequired,
    outline: PropTypes.bool.isRequired
};

ColorButtonComponent.defaultProps = {
    outline: false
};

export default ColorButtonComponent;
