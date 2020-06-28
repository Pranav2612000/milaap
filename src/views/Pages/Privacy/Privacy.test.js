import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import Privacy from './Privacy';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <Privacy />
    </MemoryRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
