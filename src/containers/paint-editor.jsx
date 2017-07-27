import PropTypes from 'prop-types';
import React from 'react';
import PaintEditorComponent from '../components/paint-editor.jsx';
import ToolsReducer from '../reducers/tools';
import ToolTypes from '../tools/tool-types.js';
import {connect} from 'react-redux';

class PaintEditor extends React.Component {
    componentDidMount () {
        document.addEventListener('keydown', this.props.onKeyPress);
    }
    componentWillUnmount () {
        document.removeEventListener('keydown', this.props.onKeyPress);
    }
    render () {
        const {
            onKeyPress, // eslint-disable-line no-unused-vars
            ...props
        } = this.props;
        return (
            <PaintEditorComponent {...props} />
        );
    }
}

PaintEditor.propTypes = {
    onKeyPress: PropTypes.func.isRequired,
    tool: PropTypes.oneOf(Object.keys(ToolTypes)).isRequired
};

const mapStateToProps = state => ({
    tool: state.tool
});
const mapDispatchToProps = dispatch => ({
    onKeyPress: e => {
        if (e.key === 'e') {
            dispatch(ToolsReducer.changeTool(ToolTypes.ERASER));
        } else if (e.key === 'b') {
            dispatch(ToolsReducer.changeTool(ToolTypes.BRUSH));
        }
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PaintEditor);
