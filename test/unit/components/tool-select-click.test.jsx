/* eslint-env jest */
import React from 'react'; // eslint-disable-line no-unused-vars
import {shallow} from 'enzyme';
import ToolSelectComponent from '../../../src/components/tool-select-base/tool-select-base.jsx'; // eslint-disable-line no-unused-vars, max-len

describe('ToolSelectComponent', () => {
    test('triggers callback when clicked', () => {
        const onClick = jest.fn();
        const componentShallowWrapper = shallow(
            <ToolSelectComponent
                imgDescriptor={{
                    defaultMessage: 'Select',
                    description: 'Label for the select tool, which allows selecting, moving, and resizing shapes',
                    id: 'paint.selectMode.select'
                }}
                imgSrc={''}
                isSelected={false}
                onMouseDown={onClick}
            />
        );
        componentShallowWrapper.simulate('click');
        expect(onClick).toHaveBeenCalled();
    });
});
