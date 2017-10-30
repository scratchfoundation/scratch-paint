import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {changeFillColor} from '../reducers/fill-color';
import {openFillColor, closeFillColor} from '../reducers/modals';
import Modes from '../modes/modes';

import FillColorIndicatorComponent from '../components/fill-color-indicator.jsx';
import {applyFillColorToSelection} from '../helper/style-path';

class FillColorIndicator extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChangeFillColor'
        ]);

        // Flag to track whether an svg-update-worthy change has been made
        this._hasChanged = false;
    }
    componentWillReceiveProps (newProps) {
        const {fillColorModalVisible, onUpdateSvg} = this.props;
        if (fillColorModalVisible && !newProps.fillColorModalVisible) {
            // Submit the new SVG, which also stores a single undo/redo action.
            if (this._hasChanged) onUpdateSvg();
            this._hasChanged = false;
        }
    }
    handleChangeFillColor (newColor) {
        // Apply color and update redux, but do not update svg until picker closes.
        const isDifferent = applyFillColorToSelection(newColor);
        this._hasChanged = this._hasChanged || isDifferent;
        this.props.onChangeFillColor(newColor);
    }
    render () {
        return (
            <FillColorIndicatorComponent
                {...this.props}
                onChangeFillColor={this.handleChangeFillColor}
            />
        );
    }
}

const mapStateToProps = state => ({
    disabled: state.scratchPaint.mode === Modes.PEN,
    fillColor: state.scratchPaint.color.fillColor,
    fillColorModalVisible: state.scratchPaint.modals.fillColor
});

const mapDispatchToProps = dispatch => ({
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor));
    },
    onOpenFillColor: () => {
        dispatch(openFillColor());
    },
    onCloseFillColor: () => {
        dispatch(closeFillColor());
    }
});

FillColorIndicator.propTypes = {
    disabled: PropTypes.bool.isRequired,
    fillColor: PropTypes.string,
    fillColorModalVisible: PropTypes.bool.isRequired,
    onChangeFillColor: PropTypes.func.isRequired,
    onUpdateSvg: PropTypes.func.isRequired
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FillColorIndicator);
