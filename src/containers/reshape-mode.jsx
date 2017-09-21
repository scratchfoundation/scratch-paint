import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../modes/modes';

import {changeMode} from '../reducers/modes';
import {setHoveredItem, clearHoveredItem} from '../reducers/hover';

import {selectSubItems} from '../helper/selection';
import ReshapeTool from '../helper/selection-tools/reshape-tool';
import ReshapeModeComponent from '../components/reshape-mode.jsx';
import paper from 'paper';


class ReshapeMode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isReshapeModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps (nextProps) {
        if (this.tool && nextProps.hoveredItem !== this.props.hoveredItem) {
            this.tool.setPrevHoveredItem(nextProps.hoveredItem);
        }

        if (nextProps.isReshapeModeActive && !this.props.isReshapeModeActive) {
            this.activateTool();
        } else if (!nextProps.isReshapeModeActive && this.props.isReshapeModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate () {
        return false; // Static component, for now
    }
    activateTool () {
        selectSubItems();
        this.tool = new ReshapeTool(this.props.setHoveredItem, this.props.clearHoveredItem);
        this.tool.setPrevHoveredItem(this.props.hoveredItem);
        this.tool.activate();
        paper.settings.handleSize = 8;
    }
    deactivateTool () {
        paper.settings.handleSize = 0;
        this.props.clearHoveredItem();
        this.tool.remove();
        this.tool = null;
        this.hitResult = null;
    }
    render () {
        return (
            <ReshapeModeComponent onMouseDown={this.props.handleMouseDown} />
        );
    }
}

ReshapeMode.propTypes = {
    clearHoveredItem: PropTypes.func.isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    hoveredItem: PropTypes.instanceOf(paper.Item), // eslint-disable-line react/no-unused-prop-types
    isReshapeModeActive: PropTypes.bool.isRequired,
    onUpdateSvg: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
    setHoveredItem: PropTypes.func.isRequired // eslint-disable-line react/no-unused-prop-types
};

const mapStateToProps = state => ({
    isReshapeModeActive: state.scratchPaint.mode === Modes.RESHAPE,
    hoveredItem: state.scratchPaint.hoveredItem
});
const mapDispatchToProps = dispatch => ({
    setHoveredItem: hoveredItem => {
        dispatch(setHoveredItem(hoveredItem));
    },
    clearHoveredItem: () => {
        dispatch(clearHoveredItem());
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.RESHAPE));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReshapeMode);
