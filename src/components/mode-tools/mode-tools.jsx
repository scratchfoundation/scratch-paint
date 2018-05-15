import paper from '@scratch/paper';
import classNames from 'classnames';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';

import {changeBrushSize} from '../../reducers/brush-mode';
import {changeBrushSize as changeEraserSize} from '../../reducers/eraser-mode';
import {changeBitBrushSize} from '../../reducers/bit-brush-size';

import Button from '../button/button.jsx';
import Dropdown from '../dropdown/dropdown.jsx';
import LiveInputHOC from '../forms/live-input-hoc.jsx';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import Input from '../forms/input.jsx';
import InputGroup from '../input-group/input-group.jsx';
import LabeledIconButton from '../labeled-icon-button/labeled-icon-button.jsx';
import Modes from '../../lib/modes';
import Fonts from '../../lib/fonts';
import Formats from '../../lib/format';
import {isBitmap, isVector} from '../../lib/format';
import styles from './mode-tools.css';

import copyIcon from './icons/copy.svg';
import pasteIcon from './icons/paste.svg';

import bitBrushIcon from '../bit-brush-mode/brush.svg';
import bitLineIcon from '../bit-line-mode/line.svg';
import brushIcon from '../brush-mode/brush.svg';
import curvedPointIcon from './icons/curved-point.svg';
import eraserIcon from '../eraser-mode/eraser.svg';
import flipHorizontalIcon from './icons/flip-horizontal.svg';
import flipVerticalIcon from './icons/flip-vertical.svg';
import straightPointIcon from './icons/straight-point.svg';

import {MAX_STROKE_WIDTH} from '../../reducers/stroke-width';

const LiveInput = LiveInputHOC(Input);
const messages = defineMessages({
    brushSize: {
        defaultMessage: 'Brush size',
        description: 'Label for the brush size input',
        id: 'paint.modeTools.brushSize'
    },
    lineSize: {
        defaultMessage: 'Line size',
        description: 'Label for the line size input',
        id: 'paint.modeTools.lineSize'
    },
    eraserSize: {
        defaultMessage: 'Eraser size',
        description: 'Label for the eraser size input',
        id: 'paint.modeTools.eraserSize'
    },
    copy: {
        defaultMessage: 'Copy',
        description: 'Label for the copy button',
        id: 'paint.modeTools.copy'
    },
    paste: {
        defaultMessage: 'Paste',
        description: 'Label for the paste button',
        id: 'paint.modeTools.paste'
    },
    curved: {
        defaultMessage: 'Curved',
        description: 'Label for the button that converts selected points to curves',
        id: 'paint.modeTools.curved'
    },
    pointed: {
        defaultMessage: 'Pointed',
        description: 'Label for the button that converts selected points to sharp points',
        id: 'paint.modeTools.pointed'
    },
    flipHorizontal: {
        defaultMessage: 'Flip Horizontal',
        description: 'Label for the button to flip the image horizontally',
        id: 'paint.modeTools.flipHorizontal'
    },
    flipVertical: {
        defaultMessage: 'Flip Vertical',
        description: 'Label for the button to flip the image vertically',
        id: 'paint.modeTools.flipVertical'
    },
    sansSerif: {
        defaultMessage: 'Sans Serif',
        description: 'Name of the sans serif font',
        id: 'paint.modeTools.sansSerif'
    },
    serif: {
        defaultMessage: 'Serif',
        description: 'Name of the serif font',
        id: 'paint.modeTools.serif'
    }
});
class ModeToolsComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'getFontStyle',
            'getTranslatedFontName',
            'handleChangeFontSerif',
            'handleChangeFontSansSerif',
            'handleOuterAction',
            'setDropdown',
            'handleClick'
        ]);
    }
    getTranslatedFontName (font) {
        switch (font) {
        case Fonts.SERIF:
            return this.props.intl.formatMessage(messages.serif);
        case Fonts.SANS_SERIF:
            return this.props.intl.formatMessage(messages.sansSerif);
        default:
            return font;
        }
    }
    getFontStyle (font) {
        switch (font) {
        case Fonts.SERIF:
            return styles.serif;
        case Fonts.SANS_SERIF:
            return styles.sansSerif;
        default:
            return font;
        }
    }
    handleChangeFontSansSerif () {
        this.props.changeFont(Fonts.SANS_SERIF);
    }
    handleChangeFontSerif () {
        this.props.changeFont(Fonts.SERIF);
    }
    handleClick () {
        this.dropDown.handleClosePopover();
    }
    handleOuterAction (e) {
        e.stopPropagation();
        this.dropDown.handleClosePopover();
        if (this.props.onClickOutsideDropdown) {
            this.props.onClickOutsideDropdown();
        }
    }
    setDropdown (element) {
        this.dropDown = element;
    }
    render () {
        switch (this.props.mode) {
        case Modes.BRUSH:
            /* falls through */
        case Modes.BIT_BRUSH:
            /* falls through */
        case Modes.BIT_LINE:
        {
            const currentIcon = isVector(this.props.format) ? brushIcon :
                this.props.mode === Modes.BIT_LINE ? bitLineIcon : bitBrushIcon;
            const currentBrushValue = isBitmap(this.props.format) ? this.props.bitBrushSize : this.props.brushValue;
            const changeFunction = isBitmap(this.props.format) ?
                this.props.onBitBrushSliderChange : this.props.onBrushSliderChange;
            const currentMessage = this.props.mode === Modes.BIT_LINE ? messages.lineSize : messages.brushSize;
            return (
                <div className={classNames(this.props.className, styles.modeTools)}>
                    <div>
                        <img
                            alt={this.props.intl.formatMessage(currentMessage)}
                            className={styles.modeToolsIcon}
                            draggable={false}
                            src={currentIcon}
                        />
                    </div>
                    <LiveInput
                        range
                        small
                        max={MAX_STROKE_WIDTH}
                        min="1"
                        type="number"
                        value={currentBrushValue}
                        onSubmit={changeFunction}
                    />
                </div>
            );
        }
        case Modes.ERASER:
            return (
                <div className={classNames(this.props.className, styles.modeTools)}>
                    <div>
                        <img
                            alt={this.props.intl.formatMessage(messages.eraserSize)}
                            className={styles.modeToolsIcon}
                            draggable={false}
                            src={eraserIcon}
                        />
                    </div>
                    <LiveInput
                        range
                        small
                        max={MAX_STROKE_WIDTH}
                        min="1"
                        type="number"
                        value={this.props.eraserValue}
                        onSubmit={this.props.onEraserSliderChange}
                    />
                </div>
            );
        case Modes.RESHAPE:
            return (
                <div className={classNames(this.props.className, styles.modeTools)}>
                    <LabeledIconButton
                        disabled={!this.props.hasSelectedUncurvedPoints}
                        imgSrc={curvedPointIcon}
                        title={this.props.intl.formatMessage(messages.curved)}
                        onClick={this.props.onCurvePoints}
                    />
                    <LabeledIconButton
                        disabled={!this.props.hasSelectedUnpointedPoints}
                        imgSrc={straightPointIcon}
                        title={this.props.intl.formatMessage(messages.pointed)}
                        onClick={this.props.onPointPoints}
                    />
                </div>
            );
        case Modes.SELECT:
            return (
                <div className={classNames(this.props.className, styles.modeTools)}>
                    <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                        <LabeledIconButton
                            disabled={!this.props.selectedItems.length}
                            imgSrc={copyIcon}
                            title={this.props.intl.formatMessage(messages.copy)}
                            onClick={this.props.onCopyToClipboard}
                        />
                        <LabeledIconButton
                            disabled={!(this.props.clipboardItems.length > 0)}
                            imgSrc={pasteIcon}
                            title={this.props.intl.formatMessage(messages.paste)}
                            onClick={this.props.onPasteFromClipboard}
                        />
                    </InputGroup>
                    <InputGroup className={classNames(styles.modLabeledIconHeight)}>
                        <LabeledIconButton
                            imgSrc={flipHorizontalIcon}
                            title={this.props.intl.formatMessage(messages.flipHorizontal)}
                            onClick={this.props.onFlipHorizontal}
                        />
                        <LabeledIconButton
                            imgSrc={flipVerticalIcon}
                            title={this.props.intl.formatMessage(messages.flipVertical)}
                            onClick={this.props.onFlipVertical}
                        />
                    </InputGroup>
                </div>
            );
        case Modes.TEXT:
            return (
                <InputGroup>
                    <Dropdown
                        className={classNames(styles.modUnselect, styles.fontDropdown)}
                        enterExitTransitionDurationMs={60}
                        popoverContent={
                            <InputGroup className={styles.modContextMenu}>
                                <Button
                                    className={classNames(styles.modMenuItem)}
                                    onClick={this.handleClick}
                                    onMouseOver={this.handleChangeFontSansSerif}
                                >
                                    <span className={styles.sansSerif}>
                                        {this.props.intl.formatMessage(messages.sansSerif)}
                                    </span>
                                </Button>
                                <Button
                                    className={classNames(styles.modMenuItem)}
                                    onClick={this.handleClick}
                                    onMouseOver={this.handleChangeFontSerif}
                                >
                                    <span className={styles.serif}>
                                        {this.props.intl.formatMessage(messages.serif)}
                                    </span>
                                </Button>
                            </InputGroup>
                        }
                        ref={this.setDropdown}
                        tipSize={.01}
                        onOpen={this.props.onOpenDropdown}
                        onOuterAction={this.handleOuterAction}
                    >
                        <span className={this.getFontStyle(this.props.fontName)}>
                            {this.getTranslatedFontName(this.props.fontName)}
                        </span>
                    </Dropdown>
                </InputGroup>
            );
        default:
            // Leave empty for now, if mode not supported
            return (
                <div className={classNames(this.props.className, styles.modeTools)} />
            );
        }
    }
}

ModeToolsComponent.propTypes = {
    bitBrushSize: PropTypes.number,
    brushValue: PropTypes.number,
    changeFont: PropTypes.func.isRequired,
    className: PropTypes.string,
    clipboardItems: PropTypes.arrayOf(PropTypes.array),
    eraserValue: PropTypes.number,
    fontName: PropTypes.string,
    format: PropTypes.oneOf(Object.keys(Formats)).isRequired,
    hasSelectedUncurvedPoints: PropTypes.bool,
    hasSelectedUnpointedPoints: PropTypes.bool,
    intl: intlShape.isRequired,
    mode: PropTypes.string.isRequired,
    onBitBrushSliderChange: PropTypes.func.isRequired,
    onBrushSliderChange: PropTypes.func.isRequired,
    onClickOutsideDropdown: PropTypes.func,
    onCopyToClipboard: PropTypes.func.isRequired,
    onCurvePoints: PropTypes.func.isRequired,
    onEraserSliderChange: PropTypes.func,
    onFlipHorizontal: PropTypes.func.isRequired,
    onFlipVertical: PropTypes.func.isRequired,
    onOpenDropdown: PropTypes.func,
    onPasteFromClipboard: PropTypes.func.isRequired,
    onPointPoints: PropTypes.func.isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.instanceOf(paper.Item))
};

const mapStateToProps = state => ({
    mode: state.scratchPaint.mode,
    format: state.scratchPaint.format,
    bitBrushSize: state.scratchPaint.bitBrushSize,
    brushValue: state.scratchPaint.brushMode.brushSize,
    clipboardItems: state.scratchPaint.clipboard.items,
    eraserValue: state.scratchPaint.eraserMode.brushSize,
    selectedItems: state.scratchPaint.selectedItems
});
const mapDispatchToProps = dispatch => ({
    onBrushSliderChange: brushSize => {
        dispatch(changeBrushSize(brushSize));
    },
    onBitBrushSliderChange: bitBrushSize => {
        dispatch(changeBitBrushSize(bitBrushSize));
    },
    onEraserSliderChange: eraserSize => {
        dispatch(changeEraserSize(eraserSize));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(ModeToolsComponent));
