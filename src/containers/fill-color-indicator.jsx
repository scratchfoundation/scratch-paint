import {connect} from 'react-redux';
import {changeFillColor} from '../reducers/fill-color';
import FillColorIndicatorComponent from '../components/fill-color-indicator.jsx';
import {applyFillColorToSelection} from '../helper/style-path';

const mapStateToProps = state => ({
    fillColor: state.scratchPaint.color.fillColor
});
const mapDispatchToProps = dispatch => ({
    onChangeFillColor: fillColor => {
        applyFillColorToSelection(fillColor);
        dispatch(changeFillColor(fillColor));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FillColorIndicatorComponent);
