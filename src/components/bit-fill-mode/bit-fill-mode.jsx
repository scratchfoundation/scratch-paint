import React from 'react';

import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import fillIcon from './fill.svg';

const BitFillComponent = () => (
    <ComingSoonTooltip
        place="right"
        tooltipId="bit-fill-mode"
    >
        <ToolSelectComponent
            disabled
            imgDescriptor={{
                defaultMessage: 'Fill',
                description: 'Label for the fill tool',
                id: 'paint.fillMode.fill'
            }}
            imgSrc={fillIcon}
            isSelected={false}
            onMouseDown={function () {}} // eslint-disable-line react/jsx-no-bind
        />
    </ComingSoonTooltip>
);

export default BitFillComponent;
