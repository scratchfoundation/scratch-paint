import PropTypes from 'prop-types';
import React from 'react';
import PaintEditorComponent from '../components/paint-editor.jsx';
import ModesReducer from '../reducers/modes';
import Modes from '../modes/modes';
import {connect} from 'react-redux';

class PaintEditor extends React.Component {
    componentDidMount () {
        document.addEventListener('keydown', this.props.onKeyPress);
    }
    componentWillUnmount () {
        document.removeEventListener('keydown', this.props.onKeyPress);
    }
    render () {
        return (
            <PaintEditorComponent />
        );
    }
}

PaintEditor.propTypes = {
    onKeyPress: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    onKeyPress: event => {
        if (event.key === 'e') {
            dispatch(ToolsReducer.changeMode(Modes.ERASER));
        } else if (event.key === 'b') {
            dispatch(ToolsReducer.changeMode(Modes.BRUSH));
        }
    }
});

export default connect(
    null,
    mapDispatchToProps
)(PaintEditor);
