import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import paper from 'paper';

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
        if (this.props.svg) {
            this.importSvg(this.props.svg);
        }
    }
    componentWillReceiveProps (newProps) {
        if (newProps.svg !== this.props.svg) {
            paper.project.activeLayer.removeChildren();
            this.importSvg(newProps.svg);
        }
    }
    componentWillUnmount () {
        paper.remove();
    }
    importSvg (svg) {
        paper.project.importSVG(svg,
            {
                expandShapes: true,
                onLoad: function (item) {
                    while (item.reduce() !== item) {
                        item = item.reduce();
                    }
                }
            });
        paper.project.view.update();
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
                ref={this.setCanvas}
            />
        );
    }
}

PaperCanvas.propTypes = {
    canvasRef: PropTypes.func,
    svg: PropTypes.string
};

export default PaperCanvas;
