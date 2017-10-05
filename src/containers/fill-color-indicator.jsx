import {connect} from 'react-redux';
import {changeFillColor} from '../reducers/fill-color';
import FillColorIndicatorComponent from '../components/fill-color-indicator.jsx';
import {applyFillColorToSelection} from '../helper/style-path';
import {performSnapshot} from '../helper/undo';
import {undoSnapshot} from '../reducers/undo';

const mapStateToProps = state => ({
    fillColor: state.scratchPaint.color.fillColor
});
const mapDispatchToProps = dispatch => ({
    onChangeFillColor: fillColor => {
        applyFillColorToSelection(fillColor, undoSnapshot);
        performSnapshot(snapshot => dispatch(undoSnapshot(snapshot)));
        dispatch(changeFillColor(fillColor));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FillColorIndicatorComponent);
