import React from 'react';
import VM from 'scratch-vm';

export default class PaintEditorComponent extends React.Component {
    render () {
        return (
            <div className="paint-editor">
            	BANANAS
            </div>
        );
     }
}

PaintEditorComponent.defaultProps = {
    vm: new VM()
};
