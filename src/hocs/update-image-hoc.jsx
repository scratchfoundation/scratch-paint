import paper from '@scratch/paper';
import PropTypes from 'prop-types';
import log from '../log/log';
import bindAll from 'lodash.bindall';
import React from 'react';
import omit from 'lodash.omit';
import {connect} from 'react-redux';

import {undoSnapshot} from '../reducers/undo';
import {setSelectedItems} from '../reducers/selected-items';

import {getSelectedLeafItems} from '../helper/selection';
import {getRaster, hideGuideLayers, showGuideLayers} from '../helper/layer';
import {commitSelectionToBitmap, getHitBounds} from '../helper/bitmap';
import {performSnapshot} from '../helper/undo';
import {scaleWithStrokes} from '../helper/math';
import {ART_BOARD_WIDTH, ART_BOARD_HEIGHT, SVG_ART_BOARD_WIDTH, SVG_ART_BOARD_HEIGHT} from '../helper/view';

import Modes from '../lib/modes';
import {BitmapModes} from '../lib/modes';
import Formats from '../lib/format';
import {isBitmap, isVector} from '../lib/format';

const UpdateImageHOC = function (WrappedComponent) {
    class UpdateImageWrapper extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'handleUpdateImage',
                'handleUpdateBitmap',
                'handleUpdateVector'
            ]);
            // When isSwitchingFormats is true, the format is about to switch, but isn't done switching.
            // This gives currently active tools a chance to finish what they were doing.
            this.isSwitchingFormats = false;
        }
        componentWillReceiveProps (newProps) {
            if ((isVector(this.props.format) && newProps.format === Formats.BITMAP) ||
                    (isBitmap(this.props.format) && newProps.format === Formats.VECTOR)) {
                console.log('update image hoc is switching formats true');
                this.isSwitchingFormats = true;
            }
        }
        componentDidUpdate (prevProps) {
            if (this.props.format === Formats.VECTOR && isBitmap(prevProps.format)) {
                console.log('update image hoc is switching formats false');
                this.isSwitchingFormats = false;
            } else if (isVector(prevProps.format) && this.props.format === Formats.BITMAP) {
                console.log('update image hoc is switching formats false');
                this.isSwitchingFormats = false;
            }
        }
        handleUpdateImage (skipSnapshot) {
            console.log('handleUpdateImage');
            console.trace();
            // If in the middle of switching formats, rely on the current mode instead of format.
            let actualFormat = this.props.format;
            if (this.isSwitchingFormats) {
                actualFormat = BitmapModes[this.props.mode] ? Formats.BITMAP : Formats.VECTOR;
            }
            if (isBitmap(actualFormat)) {
                this.handleUpdateBitmap(skipSnapshot);
            } else if (isVector(actualFormat)) {
                this.handleUpdateVector(skipSnapshot);
            }
        }
        handleUpdateBitmap (skipSnapshot) {
            if (!getRaster().loaded) {
                // In general, callers of updateImage should wait for getRaster().loaded = true before
                // calling updateImage.
                // However, this may happen if the user is rapidly undoing/redoing. In this case it's safe
                // to skip the update.
                log.warn('Bitmap layer should be loaded before calling updateImage.');
                return;
            }
            // Plaster the selection onto the raster layer before exporting, if there is a selection.
            const plasteredRaster = getRaster().getSubRaster(getRaster().bounds);
            plasteredRaster.remove(); // Don't insert
            const selectedItems = getSelectedLeafItems();
            if (selectedItems.length === 1 && selectedItems[0] instanceof paper.Raster) {
                if (!selectedItems[0].loaded ||
                    (selectedItems[0].data &&
                        selectedItems[0].data.expanded &&
                        !selectedItems[0].data.expanded.loaded)) {
                    // This may get logged when rapidly undoing/redoing or changing costumes,
                    // in which case the warning is not relevant.
                    log.warn('Bitmap layer should be loaded before calling updateImage.');
                    return;
                }
                commitSelectionToBitmap(selectedItems[0], plasteredRaster);
            }
            const rect = getHitBounds(plasteredRaster);
            this.props.onUpdateImage(
                false /* isVector */,
                plasteredRaster.getImageData(rect),
                (ART_BOARD_WIDTH / 2) - rect.x,
                (ART_BOARD_HEIGHT / 2) - rect.y);

            if (!skipSnapshot) {
                performSnapshot(this.props.undoSnapshot, Formats.BITMAP);
            }
        }
        handleUpdateVector (skipSnapshot) {
            const guideLayers = hideGuideLayers(true /* includeRaster */);

            // Export at 0.5x
            scaleWithStrokes(paper.project.activeLayer, .5, new paper.Point());
            const bounds = paper.project.activeLayer.bounds;
            // @todo generate view box
            this.props.onUpdateImage(
                true /* isVector */,
                paper.project.exportSVG({
                    asString: true,
                    bounds: 'content',
                    matrix: new paper.Matrix().translate(-bounds.x, -bounds.y)
                }),
                (SVG_ART_BOARD_WIDTH / 2) - bounds.x,
                (SVG_ART_BOARD_HEIGHT / 2) - bounds.y);
            scaleWithStrokes(paper.project.activeLayer, 2, new paper.Point());
            paper.project.activeLayer.applyMatrix = true;

            showGuideLayers(guideLayers);

            if (!skipSnapshot) {
                performSnapshot(this.props.undoSnapshot, Formats.VECTOR);
            }
        }
        render () {
            const componentProps = omit(this.props, [
                'format',
                'onUpdateImage',
                'undoSnapshot'
            ]);
            return (
                <WrappedComponent
                    onUpdateImage={this.handleUpdateImage}
                    {...componentProps}
                />
            );
        }
    }

    UpdateImageWrapper.propTypes = {
        format: PropTypes.oneOf(Object.keys(Formats)),
        mode: PropTypes.oneOf(Object.keys(Modes)).isRequired,
        onUpdateImage: PropTypes.func.isRequired,
        undoSnapshot: PropTypes.func.isRequired
    };

    const mapStateToProps = state => ({
        format: state.scratchPaint.format,
        mode: state.scratchPaint.mode,
        undoState: state.scratchPaint.undo
    });
    const mapDispatchToProps = dispatch => ({
        setSelectedItems: format => {
            dispatch(setSelectedItems(getSelectedLeafItems(), isBitmap(format)));
        },
        undoSnapshot: snapshot => {
            dispatch(undoSnapshot(snapshot));
        }
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(UpdateImageWrapper);
};

export default UpdateImageHOC;
