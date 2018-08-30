import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import styles from './scrollable-canvas.css';

const ScrollableCanvasComponent = props => (
    <div
        className={classNames(
            props.style,
            {[styles.hideCursor]: props.hideCursor}
        )}
    >
        {props.children}
        <div
            className={styles.horizontalScrollbarWrapper}
            style={{pointerEvents: 'none'}}
        >
            <div
                className={styles.horizontalScrollbar}
                style={{
                    width: `${props.horizontalScrollLengthPercent}%`,
                    left: `${props.horizontalScrollStartPercent}%`,
                    pointerEvents: 'auto',
                    display: `${props.hideCursor ||
                        Math.abs(props.horizontalScrollLengthPercent - 100) < 1e-8 ? 'none' : 'block'}`
                }}
                onMouseDown={props.onHorizontalScrollbarMouseDown}
            />
        </div>
        <div
            className={styles.verticalScrollbarWrapper}
            style={{pointerEvents: 'none'}}
        >
            <div
                className={styles.verticalScrollbar}
                style={{
                    height: `${props.verticalScrollLengthPercent}%`,
                    top: `${props.verticalScrollStartPercent}%`,
                    pointerEvents: 'auto',
                    display: `${props.hideCursor ||
                        Math.abs(props.verticalScrollLengthPercent - 100) < 1e-8 ? 'none' : 'block'}`
                }}
                onMouseDown={props.onVerticalScrollbarMouseDown}
            />
        </div>
    </div>
);

ScrollableCanvasComponent.propTypes = {
    children: PropTypes.node.isRequired,
    hideCursor: PropTypes.bool,
    horizontalScrollLengthPercent: PropTypes.number,
    horizontalScrollStartPercent: PropTypes.number,
    onHorizontalScrollbarMouseDown: PropTypes.func.isRequired,
    onVerticalScrollbarMouseDown: PropTypes.func.isRequired,
    style: PropTypes.string,
    verticalScrollLengthPercent: PropTypes.number,
    verticalScrollStartPercent: PropTypes.number
};

export default ScrollableCanvasComponent;
