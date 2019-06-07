import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';

import Header from './index';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Header />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('renders home link', () => {
    const { getByText } = render(<Header />);
    expect(getByText('gifted')).toBeInTheDocument();
});

it('renders search input', () => {
    const { getByPlaceholderText } = render(<Header />);
    expect(getByPlaceholderText('Search...')).toBeInTheDocument();
});

it('renders view toggle button', () => {
    const { getByText } = render(<Header />);
    expect(getByText('Toggle view')).toBeInTheDocument();
});