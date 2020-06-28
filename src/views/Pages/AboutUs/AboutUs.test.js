import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import AboutUs from './AboutUs';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <AboutUs />
    </MemoryRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
