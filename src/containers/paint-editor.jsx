import PropTypes from 'prop-types';
import React from 'react';
import PaintEditorComponent from '../components/paint-editor.jsx';
import {changeMode} from '../reducers/modes';
import Modes from '../modes/modes';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';

class PaintEditor extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'updateSvg'
        ]);
    }
    componentDidMount () {
        document.addEventListener('keydown', this.props.onKeyPress);
    }
    shouldComponentUpdate (newProps) {
        return newProps.assetId !== this.props.assetId;
    }
    componentWillUnmount () {
        document.removeEventListener('keydown', this.props.onKeyPress);
    }
    updateSvg (svg) {
        if (!this.props.onUpdate) {
            return;
        }
        this.props.onUpdate(
            this.props.assetIndex,
            svg
        );
    }
    render () {
        return (
            <PaintEditorComponent svg={this.props.svg} />
        );
    }
}

PaintEditor.propTypes = {
    assetId: PropTypes.string,
    assetIndex: PropTypes.number,
    onKeyPress: PropTypes.func.isRequired,
    onUpdate: PropTypes.func,
    svg: PropTypes.string
};

const mapDispatchToProps = dispatch => ({
    onKeyPress: event => {
        if (event.key === 'e') {
            dispatch(changeMode(Modes.ERASER));
        } else if (event.key === 'b') {
            dispatch(changeMode(Modes.BRUSH));
        } else if (event.key === 'l') {
            dispatch(changeMode(Modes.LINE));
        }
    }
});

export default connect(
    null,
    mapDispatchToProps
)(PaintEditor);
