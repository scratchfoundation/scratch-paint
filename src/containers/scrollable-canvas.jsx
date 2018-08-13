import paper from '@scratch/paper';
import PropTypes from 'prop-types';

import React from 'react';
import {connect} from 'react-redux';
import ScrollableCanvasComponent from '../components/scrollable-canvas/scrollable-canvas.jsx';

import {ART_BOARD_WIDTH, ART_BOARD_HEIGHT, pan, zoomOnFixedPoint} from '../helper/view';
import {updateViewBounds} from '../reducers/view-bounds';
import {redrawSelectionBox} from '../reducers/selected-items';

import {getEventXY} from '../lib/touch-utils';
import bindAll from 'lodash.bindall';

class ScrollableCanvas extends React.Component {
    static get ZOOM_INCREMENT () {
        return 0.5;
    }
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleHorizontalScrollbarMouseDown',
            'handleHorizontalScrollbarMouseMove',
            'handleHorizontalScrollbarMouseUp',
            'handleVerticalScrollbarMouseDown',
            'handleVerticalScrollbarMouseMove',
            'handleVerticalScrollbarMouseUp',
            'handleWheel'
        ]);
    }
    componentDidMount () {
        if (this.props.canvas) {
            this.props.canvas.addEventListener('wheel', this.handleWheel);
        }
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.canvas) {
            if (this.props.canvas) {
                this.props.canvas.removeEventListener('wheel', this.handleWheel);
            }
            nextProps.canvas.addEventListener('wheel', this.handleWheel);
        }
    }
    handleHorizontalScrollbarMouseDown (event) {
        window.addEventListener('mousemove', this.handleHorizontalScrollbarMouseMove);
        window.addEventListener('mouseup', this.handleHorizontalScrollbarMouseUp);
        this.initialX = getEventXY(event).x;
        event.preventDefault();
    }
    handleHorizontalScrollbarMouseMove (event) {
        const dx = this.initialX - getEventXY(event).x;
        //console.log('horizontal', this.mouseDownPosition, mousePosition);
    }
    handleHorizontalScrollbarMouseUp (event) {
        window.removeEventListener('mousemove', this.handleHorizontalScrollbarMouseMove);
        window.removeEventListener('mouseup', this.handleHorizontalScrollbarMouseUp);
    }
    handleVerticalScrollbarMouseDown (event) {
        window.addEventListener('mousemove', this.handleVerticalScrollbarMouseMove);
        window.addEventListener('mouseup', this.handleVerticalScrollbarMouseUp);
        this.initialY = getEventXY(event).y;
        event.preventDefault();
    }
    handleVerticalScrollbarMouseMove (event) {
        const mousePosition = getEventXY(event);
        //console.log('vertical', this.mouseDownPosition, mousePosition);
    }
    handleVerticalScrollbarMouseUp (event) {
        window.removeEventListener('mousemove', this.handleVerticalScrollbarMouseMove);
        window.removeEventListener('mouseup', this.handleVerticalScrollbarMouseUp);
    }
    handleWheel (event) {
        // Multiplier variable, so that non-pixel-deltaModes are supported. Needed for Firefox.
        // See #529 (or LLK/scratch-blocks#1190).
        const multiplier = event.deltaMode === 0x1 ? 15 : 1;
        const deltaX = event.deltaX * multiplier;
        const deltaY = event.deltaY * multiplier;
        if (event.metaKey || event.ctrlKey) {
            // Zoom keeping mouse location fixed
            const canvasRect = this.props.canvas.getBoundingClientRect();
            const offsetX = event.clientX - canvasRect.left;
            const offsetY = event.clientY - canvasRect.top;
            const fixedPoint = paper.view.viewToProject(
                new paper.Point(offsetX, offsetY)
            );
            zoomOnFixedPoint(-deltaY / 1000, fixedPoint);
            this.props.updateViewBounds(paper.view.matrix);
            this.props.redrawSelectionBox(); // Selection handles need to be resized after zoom
        } else if (event.shiftKey && event.deltaX === 0) {
            // Scroll horizontally (based on vertical scroll delta)
            // This is needed as for some browser/system combinations which do not set deltaX.
            // See #156.
            const dx = deltaY / paper.view.zoom;
            pan(dx, 0);
            this.props.updateViewBounds(paper.view.matrix);
        } else {
            const dx = deltaX / paper.view.zoom;
            const dy = deltaY / paper.view.zoom;
            pan(dx, dy);
            this.props.updateViewBounds(paper.view.matrix);
        }
        event.preventDefault();
    }
    render () {
        let widthPercent = 0;
        let heightPercent = 0;
        let topPercent = 0;
        let leftPercent = 0;
        if (paper.project) {
            const {x, y, width, height} = paper.view.bounds;
            widthPercent = Math.floor(100 * width / ART_BOARD_WIDTH);
            heightPercent = Math.floor(100 * height / ART_BOARD_HEIGHT);
            const centerX = (x + (width / 2)) / ART_BOARD_WIDTH;
            const centerY = (y + (height / 2)) / ART_BOARD_HEIGHT;
            topPercent = Math.floor(100 * centerY) - (heightPercent / 2);
            leftPercent = Math.floor(100 * centerX) - (widthPercent / 2);
        }
        return (
            <ScrollableCanvasComponent
                hideCursor={this.props.hideCursor}
                horizontalScrollLengthPercent={widthPercent}
                horizontalScrollStartPercent={leftPercent}
                style={this.props.style}
                verticalScrollLengthPercent={heightPercent}
                verticalScrollStartPercent={topPercent}
                onHorizontalScrollbarMouseDown={this.handleHorizontalScrollbarMouseDown}
                onVerticalScrollbarMouseDown={this.handleVerticalScrollbarMouseDown}
            >
                {this.props.children}
            </ScrollableCanvasComponent>
        );
    }
}

ScrollableCanvas.propTypes = {
    canvas: PropTypes.instanceOf(Element),
    children: PropTypes.node.isRequired,
    hideCursor: PropTypes.bool,
    redrawSelectionBox: PropTypes.func.isRequired,
    style: PropTypes.string,
    updateViewBounds: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    viewBounds: state.scratchPaint.viewBounds
});
const mapDispatchToProps = dispatch => ({
    redrawSelectionBox: () => {
        dispatch(redrawSelectionBox());
    },
    updateViewBounds: matrix => {
        dispatch(updateViewBounds(matrix));
    }
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScrollableCanvas);
