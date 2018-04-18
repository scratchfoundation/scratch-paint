import React from 'react';

import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import ovalIcon from './oval.svg';

const BitOvalComponent = () => (
    <ComingSoonTooltip
        place="right"
        tooltipId="bit-oval-mode"
    >
        <ToolSelectComponent
            disabled
            imgDescriptor={{
                defaultMessage: 'Circle',
                description: 'Label for the oval-drawing tool',
                id: 'paint.ovalMode.oval'
            }}
            imgSrc={ovalIcon}
            isSelected={false}
            onMouseDown={function () {}} // eslint-disable-line react/jsx-no-bind
        />
    </ComingSoonTooltip>
);

export default BitOvalComponent;
