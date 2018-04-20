import React from 'react';

import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import selectIcon from './marquee.svg';

const BitSelectComponent = () => (
    <ComingSoonTooltip
        place="right"
        tooltipId="bit-select-mode"
    >
        <ToolSelectComponent
            disabled
            imgDescriptor={{
                defaultMessage: 'Select',
                description: 'Label for the select tool, which allows selecting, moving, and resizing shapes',
                id: 'paint.selectMode.select'
            }}
            imgSrc={selectIcon}
            isSelected={false}
            onMouseDown={function () {}} // eslint-disable-line react/jsx-no-bind
        />
    </ComingSoonTooltip>
);

export default BitSelectComponent;
