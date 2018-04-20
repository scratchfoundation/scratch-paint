import React from 'react';

import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import eraserIcon from './eraser.svg';

const BitEraserComponent = () => (
    <ComingSoonTooltip
        place="right"
        tooltipId="bit-eraser-mode"
    >
        <ToolSelectComponent
            disabled
            imgDescriptor={{
                defaultMessage: 'Eraser',
                description: 'Label for the eraser tool',
                id: 'paint.eraserMode.eraser'
            }}
            imgSrc={eraserIcon}
            isSelected={false}
            onMouseDown={function () {}} // eslint-disable-line react/jsx-no-bind
        />
    </ComingSoonTooltip>
);

export default BitEraserComponent;
