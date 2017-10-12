import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import paper from '@scratch/paper';

import {performSnapshot} from '../helper/undo';
import {undoSnapshot} from '../reducers/undo';

import styles from './paper-canvas.css';

class PaperCanvas extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'setCanvas',
            'importSvg'
        ]);
    }
    componentDidMount () {
        paper.setup(this.canvas);
        // Don't show handles by default
        paper.settings.handleSize = 0;
        if (this.props.svg) {
            this.importSvg(this.props.svg, this.props.rotationCenterX, this.props.rotationCenterY);
        }
        performSnapshot(this.props.undoSnapshot);
    }
    componentWillReceiveProps (newProps) {
        paper.project.activeLayer.removeChildren();
        this.importSvg(newProps.svg, newProps.rotationCenterX, newProps.rotationCenterY);
    }
    componentWillUnmount () {
        paper.remove();
    }
    importSvg (svg, rotationCenterX, rotationCenterY) {
        paper.project.importSVG(svg, {
            expandShapes: true,
            onLoad: function (item) {
                const itemWidth = item.bounds.width;
                const itemHeight = item.bounds.height;

                // Remove viewbox
                if (item.clipped) {
                    let mask;
                    for (const child of item.children) {
                        if (child.isClipMask()) {
                            mask = child;
                            break;
                        }
                    }
                    item.clipped = false;
                    mask.remove();
                }
                
                // Reduce single item nested in groups
                if (item.children && item.children.length === 1) {
                    item = item.reduce();
                }

                if (typeof rotationCenterX !== 'undefined' && typeof rotationCenterY !== 'undefined') {
                    item.position =
                        paper.project.view.center
                            .add(itemWidth / 2, itemHeight / 2)
                            .subtract(rotationCenterX, rotationCenterY);
                } else {
                    // Center
                    item.position = paper.project.view.center;
                }

                paper.project.view.update();
            }
        });
    }
    setCanvas (canvas) {
        this.canvas = canvas;
        if (this.props.canvasRef) {
            this.props.canvasRef(canvas);
        }
    }
    render () {
        return (
            <canvas
                className={styles.paperCanvas}
                height="400px"
                ref={this.setCanvas}
                width="500px"
            />
        );
    }
}

PaperCanvas.propTypes = {
    canvasRef: PropTypes.func,
    rotationCenterX: PropTypes.number,
    rotationCenterY: PropTypes.number,
    svg: PropTypes.string,
    undoSnapshot: PropTypes.func.isRequired
};
const mapDispatchToProps = dispatch => ({
    undoSnapshot: snapshot => {
        dispatch(undoSnapshot(snapshot));
    }
});

export default connect(
    null,
    mapDispatchToProps
)(PaperCanvas);
