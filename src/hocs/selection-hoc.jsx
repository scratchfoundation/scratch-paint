import paper from '@scratch/paper';

import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import {clearRemovedItem} from '../reducers/hover';

const SelectionHOC = function (WrappedComponent) {
    class SelectionComponent extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'removeItemById'
            ]);
        }
        componentDidUpdate () {
            for (const itemId of this.props.removedItemIds) {
                this.removeItemById(itemId);
            }
        }
        removeItemById (itemId) {
            const match = paper.project.getItem({
                match: item => (item.id === itemId)
            });
            if (match) {
                match.remove();
            }
            this.props.clearRemovedItem(itemId);
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
        clearRemovedItem: PropTypes.func.isRequired,
        hoveredItemId: PropTypes.number,
        removedItemIds: PropTypes.arrayOf(PropTypes.number)
    };

    const mapStateToProps = state => ({
        hoveredItemId: state.scratchPaint.hover.hoveredItemId,
        removedItemIds: state.scratchPaint.hover.removedItemIds
    });
    const mapDispatchToProps = dispatch => ({
        clearRemovedItem: itemId => {
            dispatch(clearRemovedItem(itemId));
        }
    });
    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(SelectionComponent);
};

export default SelectionHOC;
