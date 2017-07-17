import React from 'react';
import PaperCanvas from './paper-canvas.jsx';

export default class PaintEditorComponent extends React.Component {
    render () {
        return (
            <PaperCanvas />
        );
    }
}

PaintEditorComponent.defaultProps = {
};
