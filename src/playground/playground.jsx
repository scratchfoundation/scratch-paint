import React from 'react';
import ReactDOM from 'react-dom';
import PaintEditor from '..';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import throttle from 'redux-throttle';
import reducer from '../reducers/combine-reducers';

const appTarget = document.createElement('div');
document.body.appendChild(appTarget);
const store = applyMiddleware(
    throttle(300, {leading: true, trailing: true})
)(createStore)(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
ReactDOM.render((
    <Provider store={store}>
        <PaintEditor />
    </Provider>
), appTarget);
