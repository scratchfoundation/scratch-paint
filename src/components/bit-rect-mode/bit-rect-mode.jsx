import React from 'react';

import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import rectIcon from './rectangle.svg';

const BitRectComponent = () => (
    <ComingSoonTooltip
        place="right"
        tooltipId="bit-rect-mode"
    >
        <ToolSelectComponent
            disabled
            imgDescriptor={{
                defaultMessage: 'Rectangle',
                description: 'Label for the rectangle tool',
                id: 'paint.rectMode.rect'
            }}
            imgSrc={rectIcon}
            isSelected={false}
            onMouseDown={function () {}} // eslint-disable-line react/jsx-no-bind
        />
    </ComingSoonTooltip>
);

export default BitRectComponent;
