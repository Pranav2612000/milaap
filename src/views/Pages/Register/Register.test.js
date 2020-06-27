import React from 'react';
import { HashRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import ConnectedRegister, { Register } from './Register';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import * as action from '../../../redux/registerRedux/registerAction';
/*
jest.mock('./Register');

beforeEach(() => {
  Register.mockClear();
  handleSubmit.mockClear();
});
*/
describe('test the Register component', () => {
  let registerWrapper;
  const initialState = {
    registerReducer: {}
  };
  const mockStore = configureStore();
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    registerWrapper = mount(
      <Provider store={store}>
        <HashRouter>
          <ConnectedRegister />
        </HashRouter>
      </Provider>
    );
  });

  it('render the dumb component', () => {
    expect(registerWrapper.find(ConnectedRegister).length).toEqual(1);
  });

  it('test if register button is being pressed', () => {
    let mockedOnSubmit = jest.fn();
    registerWrapper = shallow(<Register register={mockedOnSubmit} />);
    const form = registerWrapper.find('Form').first();
    form.simulate('submit', {
      preventDefault: () => {
        return;
      }
    });
    expect(mockedOnSubmit.mock.calls.length).toBe(1);
  });

  it('test if register dispatch works', () => {
    let actions;
    store.dispatch(action.registerRequest());
    //Test if LOGIN_REQUEST is dispatched successfully

    store.dispatch(action.registerSuccess('testuser'));
    actions = store.getActions();
    expect(actions[0].type).toBe('REGISTER_REQUEST');
    expect(actions[1].type).toBe('REGISTER_SUCCESS');
  });

  /*
  it('test submit button', () => {
  });
  */
});
