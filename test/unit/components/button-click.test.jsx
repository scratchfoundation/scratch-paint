/* eslint-env jest */
import React from 'react'; // eslint-disable-line no-unused-vars
import {shallow} from 'enzyme';
import Button from '../../../src/components/button/button.jsx'; // eslint-disable-line no-unused-vars, max-len

describe('Button', () => {
    test('triggers callback when clicked', () => {
        const onClick = jest.fn();
        const componentShallowWrapper = shallow(
            <Button onClick={onClick}>
                {'Button'}
            </Button>
        );
        componentShallowWrapper.simulate('click');
        expect(onClick).toHaveBeenCalled();
    });
});
