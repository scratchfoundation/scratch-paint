import PropTypes from 'prop-types';
import React from 'react';
import PaperCanvas from '../containers/paper-canvas.jsx';
import ToolTypes from '../tools/tool-types.js';

const PaintEditorComponent = props => (
    <PaperCanvas
        tool={props.tool}
    />
);

PaintEditorComponent.propTypes = {
    tool: PropTypes.oneOf(Object.keys(ToolTypes)).isRequired
};

export default PaintEditorComponent;
