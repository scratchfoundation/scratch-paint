import paper from '@scratch/paper';
import PropTypes from 'prop-types';
import log from '../log/log';
import React from 'react';
import {connect} from 'react-redux';

import PaintEditorComponent from '../components/paint-editor/paint-editor.jsx';
import KeyboardShortcutsHOC from '../hocs/keyboard-shortcuts-hoc.jsx';
import SelectionHOC from '../hocs/selection-hoc.jsx';
import UndoHOC from '../hocs/undo-hoc.jsx';
import UpdateImageHOC from '../hocs/update-image-hoc.jsx';

import {changeMode} from '../reducers/modes';
import {changeFormat} from '../reducers/format';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items';
import {deactivateEyeDropper} from '../reducers/eye-dropper';
import {setTextEditTarget} from '../reducers/text-edit-target';
import {updateViewBounds} from '../reducers/view-bounds';

import {getSelectedLeafItems} from '../helper/selection';
import {convertToBitmap, convertToVector} from '../helper/bitmap';
import {bringToFront, sendBackward, sendToBack, bringForward} from '../helper/order';
import {groupSelection, ungroupSelection} from '../helper/group';
import {resetZoom, zoomOnSelection} from '../helper/view';
import EyeDropperTool from '../helper/tools/eye-dropper';

import Modes from '../lib/modes';
import Formats from '../lib/format';
import {isBitmap, isVector} from '../lib/format';
import bindAll from 'lodash.bindall';

class PaintEditor extends React.Component {
    static get ZOOM_INCREMENT () {
        return 0.5;
    }
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleSendBackward',
            'handleSendForward',
            'handleSendToBack',
            'handleSendToFront',
            'handleSetSelectedItems',
            'handleGroup',
            'handleUngroup',
            'handleZoomIn',
            'handleZoomOut',
            'handleZoomReset',
            'switchMode',
            'onMouseDown',
            'setCanvas',
            'setTextArea',
            'startEyeDroppingLoop',
            'stopEyeDroppingLoop'
        ]);
        this.state = {
            canvas: null,
            colorInfo: null
        };
    }
    componentDidMount () {
        document.addEventListener('keydown', this.props.onKeyPress);
        // document listeners used to detect if a mouse is down outside of the
        // canvas, and should therefore stop the eye dropper
        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('touchstart', this.onMouseDown);
    }
    componentWillReceiveProps (newProps) {
        if (isVector(this.props.format) && isBitmap(newProps.format)) {
            this.switchMode(Formats.BITMAP);
        } else if (isVector(newProps.format) && isBitmap(this.props.format)) {
            this.switchMode(Formats.VECTOR);
        }
    }
    componentDidUpdate (prevProps) {
        if (this.props.isEyeDropping && !prevProps.isEyeDropping) {
            this.startEyeDroppingLoop();
        } else if (!this.props.isEyeDropping && prevProps.isEyeDropping) {
            this.stopEyeDroppingLoop();
        } else if (this.props.isEyeDropping && this.props.viewBounds !== prevProps.viewBounds) {
            this.props.previousTool.activate();
            this.props.onDeactivateEyeDropper();
            this.stopEyeDroppingLoop();
        }

        if (this.props.format === Formats.VECTOR && isBitmap(prevProps.format)) {
            convertToVector(this.props.clearSelectedItems, this.props.onUpdateImage);
        } else if (isVector(prevProps.format) && this.props.format === Formats.BITMAP) {
            convertToBitmap(this.props.clearSelectedItems, this.props.onUpdateImage);
        }
    }
    componentWillUnmount () {
        document.removeEventListener('keydown', this.onKeyPress);
        this.stopEyeDroppingLoop();
        document.removeEventListener('mousedown', this.onMouseDown);
        document.removeEventListener('touchstart', this.onMouseDown);
    }
    switchMode (newFormat) {
        if (isVector(newFormat)) {
            switch (this.props.mode) {
            case Modes.BIT_BRUSH:
                this.props.changeMode(Modes.BRUSH);
                break;
            case Modes.BIT_LINE:
                this.props.changeMode(Modes.LINE);
                break;
            case Modes.BIT_OVAL:
                this.props.changeMode(Modes.OVAL);
                break;
            case Modes.BIT_RECT:
                this.props.changeMode(Modes.RECT);
                break;
            case Modes.BIT_TEXT:
                this.props.changeMode(Modes.TEXT);
                break;
            case Modes.BIT_FILL:
                this.props.changeMode(Modes.FILL);
                break;
            case Modes.BIT_ERASER:
                this.props.changeMode(Modes.ERASER);
                break;
            case Modes.BIT_SELECT:
                this.props.changeMode(Modes.SELECT);
                break;
            default:
                log.error(`Mode not handled: ${this.props.mode}`);
                this.props.changeMode(Modes.BRUSH);
            }
        } else if (isBitmap(newFormat)) {
            switch (this.props.mode) {
            case Modes.BRUSH:
                this.props.changeMode(Modes.BIT_BRUSH);
                break;
            case Modes.LINE:
                this.props.changeMode(Modes.BIT_LINE);
                break;
            case Modes.OVAL:
                this.props.changeMode(Modes.BIT_OVAL);
                break;
            case Modes.RECT:
                this.props.changeMode(Modes.BIT_RECT);
                break;
            case Modes.TEXT:
                this.props.changeMode(Modes.BIT_TEXT);
                break;
            case Modes.FILL:
                this.props.changeMode(Modes.BIT_FILL);
                break;
            case Modes.ERASER:
                this.props.changeMode(Modes.BIT_ERASER);
                break;
            case Modes.RESHAPE:
                /* falls through */
            case Modes.SELECT:
                this.props.changeMode(Modes.BIT_SELECT);
                break;
            default:
                log.error(`Mode not handled: ${this.props.mode}`);
                this.props.changeMode(Modes.BIT_BRUSH);
            }
        }
    }
    handleGroup () {
        groupSelection(this.props.clearSelectedItems, this.handleSetSelectedItems, this.props.onUpdateImage);
    }
    handleUngroup () {
        ungroupSelection(this.props.clearSelectedItems, this.handleSetSelectedItems, this.props.onUpdateImage);
    }
    handleSendBackward () {
        sendBackward(this.props.onUpdateImage);
    }
    handleSendForward () {
        bringForward(this.props.onUpdateImage);
    }
    handleSendToBack () {
        sendToBack(this.props.onUpdateImage);
    }
    handleSendToFront () {
        bringToFront(this.props.onUpdateImage);
    }
    handleSetSelectedItems () {
        this.props.setSelectedItems(this.props.format);
    }
    handleZoomIn () {
        zoomOnSelection(PaintEditor.ZOOM_INCREMENT);
        this.props.updateViewBounds(paper.view.matrix);
        this.handleSetSelectedItems();
    }
    handleZoomOut () {
        zoomOnSelection(-PaintEditor.ZOOM_INCREMENT);
        this.props.updateViewBounds(paper.view.matrix);
        this.handleSetSelectedItems();
    }
    handleZoomReset () {
        resetZoom();
        this.props.updateViewBounds(paper.view.matrix);
        this.handleSetSelectedItems();
    }
    setCanvas (canvas) {
        this.setState({canvas: canvas});
        this.canvas = canvas;
    }
    setTextArea (element) {
        this.setState({textArea: element});
    }
    onMouseDown (event) {
        if (event.target === paper.view.element &&
                document.activeElement instanceof HTMLInputElement) {
            document.activeElement.blur();
        }

        if (event.target !== paper.view.element && event.target !== this.state.textArea) {
            // Exit text edit mode if you click anywhere outside of canvas
            this.props.removeTextEditTarget();
        }

        if (this.props.isEyeDropping) {
            const colorString = this.eyeDropper.colorString;
            const callback = this.props.changeColorToEyeDropper;

            this.eyeDropper.remove();
            if (!this.eyeDropper.hideLoupe) {
                // If not hide loupe, that means the click is inside the canvas,
                // so apply the new color
                callback(colorString);
            }
            this.props.previousTool.activate();
            this.props.onDeactivateEyeDropper();
            this.stopEyeDroppingLoop();
        }
    }
    startEyeDroppingLoop () {
        this.eyeDropper = new EyeDropperTool(
            this.canvas,
            paper.project.view.bounds.width,
            paper.project.view.bounds.height,
            paper.project.view.pixelRatio,
            paper.view.zoom,
            paper.project.view.bounds.x,
            paper.project.view.bounds.y,
            isBitmap(this.props.format)
        );
        this.eyeDropper.pickX = -1;
        this.eyeDropper.pickY = -1;
        this.eyeDropper.activate();

        this.intervalId = setInterval(() => {
            const colorInfo = this.eyeDropper.getColorInfo(
                this.eyeDropper.pickX,
                this.eyeDropper.pickY,
                this.eyeDropper.hideLoupe
            );
            if (!colorInfo) return;
            if (
                this.state.colorInfo === null ||
                this.state.colorInfo.x !== colorInfo.x ||
                this.state.colorInfo.y !== colorInfo.y
            ) {
                this.setState({
                    colorInfo: colorInfo
                });
            }
        }, 30);
    }
    stopEyeDroppingLoop () {
        clearInterval(this.intervalId);
        this.setState({colorInfo: null});
    }
    render () {
        return (
            <PaintEditorComponent
                canRedo={this.props.shouldShowRedo}
                canUndo={this.props.shouldShowUndo}
                canvas={this.state.canvas}
                colorInfo={this.state.colorInfo}
                format={this.props.format}
                image={this.props.image}
                imageFormat={this.props.imageFormat}
                imageId={this.props.imageId}
                isEyeDropping={this.props.isEyeDropping}
                name={this.props.name}
                rotationCenterX={this.props.rotationCenterX}
                rotationCenterY={this.props.rotationCenterY}
                setCanvas={this.setCanvas}
                setTextArea={this.setTextArea}
                textArea={this.state.textArea}
                onGroup={this.handleGroup}
                onRedo={this.props.onRedo}
                onSendBackward={this.handleSendBackward}
                onSendForward={this.handleSendForward}
                onSendToBack={this.handleSendToBack}
                onSendToFront={this.handleSendToFront}
                onSwitchToBitmap={this.props.handleSwitchToBitmap}
                onSwitchToVector={this.props.handleSwitchToVector}
                onUndo={this.props.onUndo}
                onUngroup={this.handleUngroup}
                onUpdateImage={this.props.onUpdateImage}
                onUpdateName={this.props.onUpdateName}
                onZoomIn={this.handleZoomIn}
                onZoomOut={this.handleZoomOut}
                onZoomReset={this.handleZoomReset}
            />
        );
    }
}

PaintEditor.propTypes = {
    changeColorToEyeDropper: PropTypes.func,
    changeMode: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    format: PropTypes.oneOf(Object.keys(Formats)), // Internal, up-to-date data format
    handleSwitchToBitmap: PropTypes.func.isRequired,
    handleSwitchToVector: PropTypes.func.isRequired,
    image: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(HTMLImageElement)
    ]),
    imageFormat: PropTypes.string, // The incoming image's data format, used during import
    imageId: PropTypes.string,
    isEyeDropping: PropTypes.bool,
    mode: PropTypes.oneOf(Object.keys(Modes)).isRequired,
    name: PropTypes.string,
    onDeactivateEyeDropper: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onRedo: PropTypes.func.isRequired,
    onUndo: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    onUpdateName: PropTypes.func.isRequired,
    previousTool: PropTypes.shape({ // paper.Tool
        activate: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired
    }),
    removeTextEditTarget: PropTypes.func.isRequired,
    rotationCenterX: PropTypes.number,
    rotationCenterY: PropTypes.number,
    setSelectedItems: PropTypes.func.isRequired,
    shouldShowRedo: PropTypes.func.isRequired,
    shouldShowUndo: PropTypes.func.isRequired,
    updateViewBounds: PropTypes.func.isRequired,
    viewBounds: PropTypes.instanceOf(paper.Matrix).isRequired
};

const mapStateToProps = state => ({
    changeColorToEyeDropper: state.scratchPaint.color.eyeDropper.callback,
    clipboardItems: state.scratchPaint.clipboard.items,
    format: state.scratchPaint.format,
    isEyeDropping: state.scratchPaint.color.eyeDropper.active,
    mode: state.scratchPaint.mode,
    pasteOffset: state.scratchPaint.clipboard.pasteOffset,
    previousTool: state.scratchPaint.color.eyeDropper.previousTool,
    selectedItems: state.scratchPaint.selectedItems,
    viewBounds: state.scratchPaint.viewBounds
});
const mapDispatchToProps = dispatch => ({
    changeMode: mode => {
        dispatch(changeMode(mode));
    },
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    handleSwitchToBitmap: () => {
        dispatch(changeFormat(Formats.BITMAP));
    },
    handleSwitchToVector: () => {
        dispatch(changeFormat(Formats.VECTOR));
    },
    removeTextEditTarget: () => {
        dispatch(setTextEditTarget());
    },
    setSelectedItems: format => {
        dispatch(setSelectedItems(getSelectedLeafItems(), isBitmap(format)));
    },
    onDeactivateEyeDropper: () => {
        // set redux values to default for eye dropper reducer
        dispatch(deactivateEyeDropper());
    },
    updateViewBounds: matrix => {
        dispatch(updateViewBounds(matrix));
    }
});

export default UpdateImageHOC(SelectionHOC(UndoHOC(KeyboardShortcutsHOC(connect(
    mapStateToProps,
    mapDispatchToProps
)(PaintEditor)))));
