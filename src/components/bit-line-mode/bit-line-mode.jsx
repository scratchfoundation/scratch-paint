import React from 'react';

import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import lineIcon from './line.svg';

const BitLineComponent = () => (
    <ComingSoonTooltip
        place="right"
        tooltipId="bit-line-mode"
    >
        <ToolSelectComponent
            disabled
            imgDescriptor={{
                defaultMessage: 'Line',
                description: 'Label for the line tool, which draws straight line segments',
                id: 'paint.lineMode.line'
            }}
            imgSrc={lineIcon}
            isSelected={false}
            onMouseDown={function () {}} // eslint-disable-line react/jsx-no-bind
        />
    </ComingSoonTooltip>
);

export default BitLineComponent;
