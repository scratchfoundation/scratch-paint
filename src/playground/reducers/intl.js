import {IntlProvider, intlReducer, updateIntl as superUpdateIntl} from 'react-intl-redux';

import paintMessages from 'scratch-l10n/locales/paint-editor-msgs';

const intlInitialState = {
    intl: {
        defaultLocale: 'en',
        locale: 'en',
        messages: paintMessages.en
    }
};

const updateIntl = locale => superUpdateIntl({
    locale: locale,
    messages: paintMessages[locale] || paintMessages.en
});

export {
    intlReducer as default,
    IntlProvider,
    intlInitialState,
    updateIntl
};
