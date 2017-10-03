import paper from 'paper';

import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';

import {getSelectedItems} from '../helper/selection';
import {getColorsFromSelection} from '../helper/style-path';
import {changeStrokeColor} from '../reducers/stroke-color';
import {changeStrokeWidth} from '../reducers/stroke-width';
import {changeFillColor} from '../reducers/fill-color';

const SelectionHOC = function (WrappedComponent) {
    class SelectionComponent extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'removeItemById'
            ]);
        }
        componentDidMount () {
            if (this.props.hoveredItemId) {
                paper.view.update();
            }
        }
        componentDidUpdate (prevProps) {
            // Hovered item has changed
            if ((this.props.hoveredItemId && this.props.hoveredItemId !== prevProps.hoveredItemId) ||
                    (!this.props.hoveredItemId && prevProps.hoveredItemId)) {
                // Remove the old hover item if any
                this.removeItemById(prevProps.hoveredItemId);
            }
        }
        removeItemById (itemId) {
            if (itemId) {
                const match = paper.project.getItem({
                    match: item => (item.id === itemId)
                });
                if (match) {
                    match.remove();
                }
            }
        }
        render () {
            const {
                hoveredItemId, // eslint-disable-line no-unused-vars
                ...props
            } = this.props;
            return (
                <WrappedComponent {...props} />
            );
        }
    }
    SelectionComponent.propTypes = {
        hoveredItemId: PropTypes.number
    };

    const mapStateToProps = state => ({
        hoveredItemId: state.scratchPaint.hoveredItemId
    });
    const mapDispatchToProps = dispatch => ({
        onUpdateColors: (() => {
            const selectedItems = getSelectedItems(true /* recursive */);
            if (selectedItems.length === 0) {
                return;
            }
            const colorState = getColorsFromSelection(selectedItems);
            dispatch(changeFillColor(colorState.fillColor));
            dispatch(changeStrokeColor(colorState.strokeColor));
            dispatch(changeStrokeWidth(colorState.strokeWidth));
        })
    });
    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(SelectionComponent);
};

export default SelectionHOC;
