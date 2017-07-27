import React from 'react';
import ReactDOM from 'react-dom';
import PaintEditor from '..';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducer from '../reducers/combine-reducers';

const appTarget = document.createElement('div');
document.body.appendChild(appTarget);
const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
ReactDOM.render((
    <Provider store={store}>
        <PaintEditor />
    </Provider>
), appTarget);
