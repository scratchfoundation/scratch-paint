import React from 'react';
import ReactDOM from 'react-dom';
import PaintEditor from '..';

const appTarget = document.createElement('div');
document.body.appendChild(appTarget);
ReactDOM.render(
    <PaintEditor />,
    appTarget);
