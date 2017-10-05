import {connect} from 'react-redux';
import {changeStrokeColor} from '../reducers/stroke-color';
import StrokeColorIndicatorComponent from '../components/stroke-color-indicator.jsx';
import {applyStrokeColorToSelection} from '../helper/style-path';
import {performSnapshot} from '../helper/undo';
import {undoSnapshot} from '../reducers/undo';

const mapStateToProps = state => ({
    strokeColor: state.scratchPaint.color.strokeColor
});
const mapDispatchToProps = dispatch => ({
    onChangeStrokeColor: strokeColor => {
        applyStrokeColorToSelection(strokeColor, undoSnapshot);
        performSnapshot(snapshot => dispatch(undoSnapshot(snapshot)));
        dispatch(changeStrokeColor(strokeColor));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StrokeColorIndicatorComponent);
