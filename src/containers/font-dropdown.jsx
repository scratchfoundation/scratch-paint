import paper from '@scratch/paper';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import FontDropdownComponent from '../components/font-dropdown/font-dropdown.jsx';
import Fonts from '../lib/fonts';
import {changeFont} from '../reducers/font';
import {getSelectedLeafItems} from '../helper/selection';
import styles from '../components/font-dropdown/font-dropdown.css';

const messages = defineMessages({
    sansSerif: {
        defaultMessage: 'Sans Serif',
        description: 'Name of the sans serif font',
        id: 'paint.modeTools.sansSerif'
    },
    serif: {
        defaultMessage: 'Serif',
        description: 'Name of the serif font',
        id: 'paint.modeTools.serif'
    },
    handwriting: {
        defaultMessage: 'Handwriting',
        description: 'Name of the handwriting font',
        id: 'paint.modeTools.handwriting'
    },
    marker: {
        defaultMessage: 'Marker',
        description: 'Name of the marker font',
        id: 'paint.modeTools.marker'
    },
    curly: {
        defaultMessage: 'Curly',
        description: 'Name of the curly font',
        id: 'paint.modeTools.curly'
    },
    pixel: {
        defaultMessage: 'Pixel',
        description: 'Name of the pixelated font',
        id: 'paint.modeTools.pixel'
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
            'handleChangeFontHandwriting',
            'handleChangeFontMarker',
            'handleChangeFontCurly',
            'handleChangeFontPixel',
            'handleChangeFontChinese',
            'handleChangeFontJapanese',
            'handleChangeFontKorean',
            'handleOpenDropdown',
            'handleClickOutsideDropdown',
            'setDropdown',
            'handleChoose'
        ]);
    }
    getFontStyle (font) {
        switch (font) {
        case Fonts.SERIF:
            return styles.serif;
        case Fonts.SANS_SERIF:
            return styles.sansSerif;
        case Fonts.HANDWRITING:
            return styles.handwriting;
        case Fonts.MARKER:
            return styles.marker;
        case Fonts.CURLY:
            return styles.curly;
        case Fonts.PIXEL:
            return styles.pixel;
        case Fonts.CHINESE:
            return styles.chinese;
        case Fonts.JAPANESE:
            return styles.japanese;
        case Fonts.KOREAN:
            return styles.korean;
        default:
            return '';
        }
    }
    getTranslatedFontName (font) {
        switch (font) {
        case Fonts.SERIF:
            return this.props.intl.formatMessage(messages.serif);
        case Fonts.SANS_SERIF:
            return this.props.intl.formatMessage(messages.sansSerif);
        case Fonts.HANDWRITING:
            return this.props.intl.formatMessage(messages.handwriting);
        case Fonts.MARKER:
            return this.props.intl.formatMessage(messages.marker);
        case Fonts.CURLY:
            return this.props.intl.formatMessage(messages.curly);
        case Fonts.PIXEL:
            return this.props.intl.formatMessage(messages.pixel);
        case Fonts.CHINESE:
            return '中文';
        case Fonts.KOREAN:
            return '한국어';
        case Fonts.JAPANESE:
            return '日本語';
        default:
            return font;
        }
    }
    handleChangeFontSansSerif () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.SANS_SERIF);
        }
    }
    handleChangeFontSerif () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.SERIF);
        }
    }
    handleChangeFontHandwriting () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.HANDWRITING);
        }
    }
    handleChangeFontMarker () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.MARKER);
        }
    }
    handleChangeFontCurly () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.CURLY);
        }
    }
    handleChangeFontPixel () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.PIXEL);
        }
    }
    handleChangeFontChinese () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.CHINESE);
        }
    }
    handleChangeFontJapanese () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.JAPANESE);
        }
    }
    handleChangeFontKorean () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.KOREAN);
        }
    }
    handleChoose () {
        if (this.dropDown.isOpen()) {
            this.dropDown.handleClosePopover();
            this.props.onUpdateImage();
        }
    }
    handleOpenDropdown () {
        this.savedFont = this.props.font;
        this.savedSelection = getSelectedLeafItems();
    }
    handleClickOutsideDropdown (e) {
        e.stopPropagation();
        this.dropDown.handleClosePopover();

        // Cancel font change
        for (const item of this.savedSelection) {
            if (item instanceof paper.PointText) {
                item.font = this.savedFont;
            }
        }

        this.props.changeFont(this.savedFont);
        this.savedFont = null;
        this.savedSelection = null;
    }
    setDropdown (element) {
        this.dropDown = element;
    }
    render () {
        return (
            <FontDropdownComponent
                componentRef={this.setDropdown}
                font={this.props.font}
                getFontStyle={this.getFontStyle}
                getTranslatedFontName={this.getTranslatedFontName}
                onChoose={this.handleChoose}
                onClickOutsideDropdown={this.handleClickOutsideDropdown}
                onHoverChinese={this.handleChangeFontChinese}
                onHoverCurly={this.handleChangeFontCurly}
                onHoverHandwriting={this.handleChangeFontHandwriting}
                onHoverJapanese={this.handleChangeFontJapanese}
                onHoverKorean={this.handleChangeFontKorean}
                onHoverMarker={this.handleChangeFontMarker}
                onHoverPixel={this.handleChangeFontPixel}
                onHoverSansSerif={this.handleChangeFontSansSerif}
                onHoverSerif={this.handleChangeFontSerif}
                onOpenDropdown={this.handleOpenDropdown}
            />
        );
    }
}

ModeToolsComponent.propTypes = {
    changeFont: PropTypes.func.isRequired,
    font: PropTypes.string,
    intl: intlShape.isRequired,
    onUpdateImage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    font: state.scratchPaint.font
});
const mapDispatchToProps = dispatch => ({
    changeFont: font => {
        dispatch(changeFont(font));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(ModeToolsComponent));
