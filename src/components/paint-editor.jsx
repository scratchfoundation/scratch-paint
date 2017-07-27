import bindAll from 'lodash.bindall';
import React from 'react';
import PaperCanvas from '../containers/paper-canvas.jsx';
import BrushTool from '../containers/tools/brush-tool.jsx';
import EraserTool from '../containers/tools/eraser-tool.jsx';

class PaintEditorComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'setCanvas'
        ]);
        this.state = {};
    }
    setCanvas (canvas) {
        this.setState({canvas: canvas});
    }
    render () {
        // Tools can't work without a canvas, so we don't render them until we have it
        if (this.state.canvas) {
            return (
                <div>
                    <PaperCanvas canvasRef={this.setCanvas} />
                    <BrushTool canvas={this.state.canvas} />
                    <EraserTool canvas={this.state.canvas} />
                </div>
            );
        }
        return (
            <div>
                <PaperCanvas canvasRef={this.setCanvas} />
            </div>
        );
    }
}

export default PaintEditorComponent;
