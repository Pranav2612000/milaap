import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import Guest from './Guest';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <Guest />
    </MemoryRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
