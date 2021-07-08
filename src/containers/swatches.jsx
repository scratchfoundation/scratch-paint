import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import paper from '@scratch/paper';
import PropTypes from 'prop-types';
import React from 'react';

import {clearSelectedItems} from '../reducers/selected-items';
import {activateEyeDropper} from '../reducers/eye-dropper';

import SwatchesComponent from '../components/swatches/swatches.jsx';
import {MIXED, colorsEqual} from '../helper/style-path';
import {colorStringToHsv, getRow1Colors, getRow2Colors} from '../lib/colors';
import ColorProptype from '../lib/color-proptype';

class Swatches extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'colorMatchesActiveColor',
            'handleSwatch',
            'handleTransparent',
            'handleActivateEyeDropper'
        ]);
    }
    colorMatchesActiveColor (color) {
        // Eyedropper is the "active color" when eyedropping
        if (this.props.isEyeDropping) return false;
        let activeColor;
        if (this.props.isStrokeColor) {
            if (this.props.colorIndex === 1) {
                activeColor = this.props.strokeColor2;
            } else {
                activeColor = this.props.strokeColor;
            }
        } else if (!this.props.isStrokeColor) {
            if (this.props.colorIndex === 1) {
                activeColor = this.props.fillColor2;
            } else {
                activeColor = this.props.fillColor;
            }
        }
        return colorsEqual(activeColor, color);
    }
    /**
     * @param{string} color - a hex color
     */
    handleSwatch (color) {
        this.props.onChangeColor(color);
    }
    handleTransparent () {
        this.props.onChangeColor(null);
    }
    handleActivateEyeDropper () {
        this.props.onActivateEyeDropper(
            paper.tool, // get the currently active tool from paper
            this.props.onChangeColor
        );
    }
    render () {
        return (
            <SwatchesComponent
                color={this.props.isStrokeColor ? this.props.strokeColor : this.props.fillColor}
                color2={this.props.isStrokeColor ? this.props.strokeColor2 : this.props.fillColor2}
                containerStyle={this.props.containerStyle}
                row1Colors={getRow1Colors()}
                row2Colors={getRow2Colors()}
                colorMatchesActiveColor={this.colorMatchesActiveColor}
                colorIndex={this.props.colorIndex}
                isEyeDropping={this.props.isEyeDropping}
                isStrokeColor={this.props.isStrokeColor}
                small={this.props.small}
                onActivateEyeDropper={this.handleActivateEyeDropper}
                onSwatch={this.handleSwatch}
                onTransparent={this.handleTransparent}
            />
        );
    }
}

Swatches.propTypes = {
    colorIndex: PropTypes.number.isRequired,
    containerStyle: PropTypes.string,
    fillColor: ColorProptype,
    fillColor2: ColorProptype,
    isEyeDropping: PropTypes.bool.isRequired,
    isStrokeColor: PropTypes.bool.isRequired,
    small: PropTypes.bool,
    strokeColor: ColorProptype,
    strokeColor2: ColorProptype,
    onActivateEyeDropper: PropTypes.func.isRequired,
    onChangeColor: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    colorIndex: state.scratchPaint.fillMode.colorIndex,
    isEyeDropping: state.scratchPaint.color.eyeDropper.active,
    colorIndex: state.scratchPaint.fillMode.colorIndex,
    fillColor: state.scratchPaint.color.fillColor.primary,
    fillColor2: state.scratchPaint.color.fillColor.secondary,
    strokeColor: state.scratchPaint.color.strokeColor.primary,
    strokeColor2: state.scratchPaint.color.strokeColor.secondary
});

const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    onActivateEyeDropper: (currentTool, callback) => {
        dispatch(activateEyeDropper(currentTool, callback));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Swatches);
