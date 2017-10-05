import {connect} from 'react-redux';
import {changeStrokeWidth} from '../reducers/stroke-width';
import StrokeWidthIndicatorComponent from '../components/stroke-width-indicator.jsx';
import {applyStrokeWidthToSelection} from '../helper/style-path';
import {performSnapshot} from '../helper/undo';
import {undoSnapshot} from '../reducers/undo';

const mapStateToProps = state => ({
    strokeWidth: state.scratchPaint.color.strokeWidth
});
const mapDispatchToProps = dispatch => ({
    onChangeStrokeWidth: strokeWidth => {
        applyStrokeWidthToSelection(strokeWidth, undoSnapshot);
        performSnapshot(snapshot => dispatch(undoSnapshot(snapshot)));
        dispatch(changeStrokeWidth(strokeWidth));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StrokeWidthIndicatorComponent);
