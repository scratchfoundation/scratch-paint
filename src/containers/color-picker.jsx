import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import paper from '@scratch/paper';
import ColorProptype from '../lib/color-proptype';
import PropTypes from 'prop-types';
import React from 'react';

import {changeColorIndex} from '../reducers/color-index';
import {clearSelectedItems} from '../reducers/selected-items';
import {activateEyeDropper} from '../reducers/eye-dropper';
import GradientTypes from '../lib/gradient-types';

import ColorPickerComponent from '../components/color-picker/color-picker.jsx';
import {MIXED} from '../helper/style-path';
import Modes from '../lib/modes';

// Important! This component ignores new color props except when isEyeDropping
// This is to make the HSV <=> RGB conversion stable. The sliders manage their
// own changes until unmounted or color changes with props.isEyeDropping = true.
class ColorPicker extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChangeGradientTypeHorizontal',
            'handleChangeGradientTypeRadial',
            'handleChangeGradientTypeSolid',
            'handleChangeGradientTypeVertical',
            'handleHueChange',
            'handleSaturationChange',
            'handleBrightnessChange',
            'handleTransparent',
            'handleActivateEyeDropper'
        ]);

        const color = props.colorIndex === 0 ? props.color : props.color2;
        const hsv = this.getHsv(color);
        this.state = {
            hue: hsv[0],
            saturation: hsv[1],
            brightness: hsv[2]
        };
    }
    componentWillReceiveProps (newProps) {
        const color = newProps.colorIndex === 0 ? this.props.color : this.props.color2;
        const newColor = newProps.colorIndex === 0 ? newProps.color : newProps.color2;
        const colorSetByEyedropper = this.props.isEyeDropping && color !== newColor;
        if (colorSetByEyedropper || this.props.colorIndex !== newProps.colorIndex) {
            const hsv = this.getHsv(newColor);
            this.setState({
                hue: hsv[0],
                saturation: hsv[1],
                brightness: hsv[2]
            });
        }
    }
    getHsv (color) {
        const isTransparent = color === null;
        const isMixed = color === MIXED;
        return isTransparent || isMixed ?
            [50, 100, 100] : [
                color.hue * (100 / 360),
                color.saturation * 100,
                color.brightness * 100
            ];
    }
    handleHueChange (hue) {
        this.setState({hue: hue}, () => {
            this.handleColorChange();
        });
    }
    handleSaturationChange (saturation) {
        this.setState({saturation: saturation}, () => {
            this.handleColorChange();
        });
    }
    handleBrightnessChange (brightness) {
        this.setState({brightness: brightness}, () => {
            this.handleColorChange();
        });
    }
    handleColorChange () {
        this.props.onChangeColor(new paper.Color({
            hue: this.state.hue * (360 / 100),
            saturation: this.state.saturation / 100,
            brightness: this.state.brightness / 100
        }));
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
    handleChangeGradientTypeHorizontal () {
        this.props.onChangeGradientType(GradientTypes.HORIZONTAL);
    }
    handleChangeGradientTypeRadial () {
        this.props.onChangeGradientType(GradientTypes.RADIAL);
    }
    handleChangeGradientTypeSolid () {
        this.props.onChangeGradientType(GradientTypes.SOLID);
    }
    handleChangeGradientTypeVertical () {
        this.props.onChangeGradientType(GradientTypes.VERTICAL);
    }
    render () {
        return (
            <ColorPickerComponent
                brightness={this.state.brightness}
                color={this.props.color}
                color2={this.props.color2}
                colorIndex={this.props.colorIndex}
                gradientType={this.props.gradientType}
                hue={this.state.hue}
                isEyeDropping={this.props.isEyeDropping}
                mode={this.props.mode}
                rtl={this.props.rtl}
                saturation={this.state.saturation}
                shouldShowGradientTools={this.props.shouldShowGradientTools}
                onActivateEyeDropper={this.handleActivateEyeDropper}
                onBrightnessChange={this.handleBrightnessChange}
                onChangeGradientTypeHorizontal={this.handleChangeGradientTypeHorizontal}
                onChangeGradientTypeRadial={this.handleChangeGradientTypeRadial}
                onChangeGradientTypeSolid={this.handleChangeGradientTypeSolid}
                onChangeGradientTypeVertical={this.handleChangeGradientTypeVertical}
                onHueChange={this.handleHueChange}
                onSaturationChange={this.handleSaturationChange}
                onSelectColor={this.props.onSelectColor}
                onSelectColor2={this.props.onSelectColor2}
                onSwap={this.props.onSwap}
                onTransparent={this.handleTransparent}
            />
        );
    }
}

ColorPicker.propTypes = {
    color: ColorProptype,
    color2: ColorProptype,
    colorIndex: PropTypes.number.isRequired,
    gradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired,
    isEyeDropping: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(Object.keys(Modes)),
    onActivateEyeDropper: PropTypes.func.isRequired,
    onChangeColor: PropTypes.func.isRequired,
    onChangeGradientType: PropTypes.func,
    onSelectColor: PropTypes.func.isRequired,
    onSelectColor2: PropTypes.func.isRequired,
    onSwap: PropTypes.func,
    rtl: PropTypes.bool.isRequired,
    shouldShowGradientTools: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    colorIndex: state.scratchPaint.fillMode.colorIndex,
    isEyeDropping: state.scratchPaint.color.eyeDropper.active,
    mode: state.scratchPaint.mode,
    rtl: state.scratchPaint.layout.rtl
});

const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    onActivateEyeDropper: (currentTool, callback) => {
        dispatch(activateEyeDropper(currentTool, callback));
    },
    onSelectColor: () => {
        dispatch(changeColorIndex(0));
    },
    onSelectColor2: () => {
        dispatch(changeColorIndex(1));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ColorPicker);
