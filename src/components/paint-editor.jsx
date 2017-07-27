import PropTypes from 'prop-types';
import React from 'react';
import PaperCanvas from '../containers/paper-canvas.jsx';
import BrushTool from '../containers/tools/brush-tool.jsx';
import EraserTool from '../containers/tools/eraser-tool.jsx';
import ToolTypes from '../tools/tool-types.js';

class PaintEditorComponent extends React.Component {
    render () {
        return (
            <div>
                <PaperCanvas
                    ref={canvas => {
                        this.canvas = canvas;
                    }}
                    tool={this.props.tool}
                />
                <BrushTool canvas={this.canvas} />
                <EraserTool canvas={this.canvas} />
            </div>
        );
    }
}

PaintEditorComponent.propTypes = {
    tool: PropTypes.oneOf(Object.keys(ToolTypes)).isRequired
};

export default PaintEditorComponent;
