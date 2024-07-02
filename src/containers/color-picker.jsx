import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import paper from '@scratch/paper';
import parseColor from 'parse-color';
import PropTypes from 'prop-types';
import React from 'react';

import {changeColorIndex} from '../reducers/color-index';
import {clearSelectedItems} from '../reducers/selected-items';
import {activateEyeDropper} from '../reducers/eye-dropper';
import GradientTypes from '../lib/gradient-types';

import ColorPickerComponent from '../components/color-picker/color-picker.jsx';
import {MIXED} from '../helper/style-path';
import Modes from '../lib/modes';

const colorStringToHsv = hexString => {
    const hsv = parseColor(hexString).hsv;
    // Hue comes out in [0, 360], limit to [0, 100]
    hsv[0] = hsv[0] / 3.6;
    // Black is parsed as {0, 0, 0}, but turn saturation up to 100
    // to make it easier to see slider values.
    if (hsv[1] === 0 && hsv[2] === 0) {
        hsv[1] = 100;
    }
    return hsv;
};

const hsvToHex = (h, s, v, alpha = 100) => {
    // Scale alpha from [0, 100] to [0, 1]
    const alphaNormalized = alpha / 100;
    // Scale hue back up to [0, 360] from [0, 100]
    const color = parseColor(`hsv(${3.6 * h}, ${s}, ${v})`);
    // Get the hex value without the alpha channel
    const hex = color.hex;
    // Calculate the alpha value in hex (0-255)
    const alphaHex = Math.round(alphaNormalized * 255).toString(16).padStart(2, '0');
    // Return the hex value with the alpha channel
    return `${hex}${alphaHex}`;
};


// Important! This component ignores new color props except when isEyeDropping
// This is to make the HSV <=> RGB conversion stable. The sliders manage their
// own changes until unmounted or color changes with props.isEyeDropping = true.
class ColorPicker extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'getHsv',
            'handleChangeGradientTypeHorizontal',
            'handleChangeGradientTypeRadial',
            'handleChangeGradientTypeSolid',
            'handleChangeGradientTypeVertical',
            'handleHueChange',
            'handleSaturationChange',
            'handleBrightnessChange',
            'handleAlphaChange',
            'handleTransparent',
            'handleActivateEyeDropper'
        ]);

        const color = props.colorIndex === 0 ? props.color : props.color2;
        const hsv = this.getHsv(color);
        const alpha = this.getAlpha(color);

        this.state = {
            hue: hsv[0],
            saturation: hsv[1],
            brightness: hsv[2],
            alpha: alpha * 100
        };
    }
    componentWillReceiveProps (newProps) {
        const color = newProps.colorIndex === 0 ? this.props.color : this.props.color2;
        const newColor = newProps.colorIndex === 0 ? newProps.color : newProps.color2;
        const colorSetByEyedropper = this.props.isEyeDropping && color !== newColor;
        if (colorSetByEyedropper || this.props.colorIndex !== newProps.colorIndex) {
            const hsv = this.getHsv(newColor);
            const alpha = this.getAlpha(newColor);

            this.setState({
                hue: hsv[0],
                saturation: hsv[1],
                brightness: hsv[2],
                alpha: alpha * 100
            });
        }
    }
    getHsv (color) {
        const isTransparent = color === null;
        const isMixed = color === MIXED;
        return isTransparent || isMixed ?
            [50, 100, 100] : colorStringToHsv(color);
    }
    getAlpha(color) {
        // TODO: need to find a way to get the alpha from all kinds of color strings (rgb, rgba, hex, hex with alpha, etc.)
        // parse-color returns a range of 0-255 for hex inputs, but 0-1 for any other input
        // (for hex codes without an alpha value, parse-color returns an alpha of 1)
        
        if (!color) return 0; // transparent swatch

        const result = parseColor(color)
        if (!result?.rgba) return 1; // no alpha value

        let alpha = result.rgba[3]

        if (color.startsWith('#') && alpha !== 1) {
            // We used a hex color, divide parse-color alpha value by 255

            alpha = alpha / 255
        }
        
        return alpha
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
    handleAlphaChange (alpha) {
        this.setState({alpha: alpha}, () => {
            this.handleColorChange();
        });
    }
    handleColorChange () {
        this.props.onChangeColor(hsvToHex(
            this.state.hue,
            this.state.saturation,
            this.state.brightness,
            this.state.alpha
        ));
    }
    handleTransparent () {
        // TODO: UX - should this reset all sliders, or just the alpha?
        this.setState({alpha: 0}, () => {
            this.handleColorChange();
        });
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
                allowAlpha={this.props.allowAlpha}
                brightness={this.state.brightness}
                alpha={this.state.alpha}
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
                onAlphaChange={this.handleAlphaChange}
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
    allowAlpha: PropTypes.bool,
    color: PropTypes.string,
    color2: PropTypes.string,
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
