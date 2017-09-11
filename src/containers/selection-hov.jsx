import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import paper from 'paper';

const SelectionHOV = function (WrappedComponent) {
    class SelectionComponent extends React.Component {
        componentDidMount () {
            if (this.props.hoveredItem) {
                paper.view.update();
            }
        }
        componentDidUpdate (prevProps) {
            if (this.props.hoveredItem && this.props.hoveredItem !== prevProps.hoveredItem) {
                // A hover item has been added. Update the view
                paper.view.update();
            } else if (!this.props.hoveredItem && prevProps.hoveredItem) {
                // Remove the hover item
                prevProps.hoveredItem.remove();
                paper.view.update();
            }
        }
        render () {
            const {
                hoveredItem, // eslint-disable-line no-unused-vars
                ...props
            } = this.props;
            return (
                <WrappedComponent {...props} />
            );
        }
    }
    SelectionComponent.propTypes = {
        hoveredItem: PropTypes.instanceOf(paper.Item)
    };

    const mapStateToProps = state => ({
        hoveredItem: state.scratchPaint.hoveredItem
    });
    return connect(
        mapStateToProps
    )(SelectionComponent);
};

export default SelectionHOV;
