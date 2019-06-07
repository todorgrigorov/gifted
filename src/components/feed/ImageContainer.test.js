import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';

import ImageContainer from './ImageContainer';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ImageContainer />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('renders view toggle button', () => {
    const { container, getByText, getByAltText } = render(<ImageContainer id='1234' src='' imageHeight={100} imageWidth={100} />)
    expect(getByAltText('1234')).toBeInTheDocument();
});