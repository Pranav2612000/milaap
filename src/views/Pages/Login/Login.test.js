import React from 'react';
import { HashRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import ConnectedLogin, { Login } from './Login';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import * as action from '../../../redux/loginRedux/loginAction';

describe('login component test', () => {
  let loginWrapper;
  const initialState = {
    loginReducer: {
      loggedIn: true
    },
    output: 100
  };
  const loginProps = {
    location: '/login'
  };
  const mockStore = configureStore();
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    loginWrapper = mount(
      <Provider store={store}>
        <HashRouter>
          <ConnectedLogin {...loginProps} />
        </HashRouter>
      </Provider>
    );
    console.log('in before');
    console.log(loginWrapper.find(Login).props());
  });

  it('render the dumb component', () => {
    expect(loginWrapper.find(ConnectedLogin).length).toEqual(1);
  });

  //Add to test successful redirection
  it('test if app redirects successfully, when logged in', () => {
    console.log(loginWrapper.find('Redirect').html());
    console.log(loginWrapper.find('Redirect').getDOMNode());
    console.log(loginWrapper.find('Redirect').name());
    expect(loginWrapper.find(Login).find('Redirect').name()).toEqual('Redirect');
  });

  it('test if notifications are displayed', () => {
    store = mockStore({
      notifications: [],
      loginReducer: {
        loggedIn: false
      }
    });
    loginWrapper = mount(
      <Provider store={store}>
        <HashRouter>
          <ConnectedLogin {...loginProps} />
        </HashRouter>
      </Provider>
    );
    expect(loginWrapper.find(Login).find('Notifications').name()).toEqual(
      'Notifications'
    );
  });

  it('check Prop matches with initialState', () => {
    expect(loginWrapper.find(Login).prop('loggedIn')).toEqual(
      initialState.loginReducer.loggedIn
    );
  });

  it('test if login button is being pressed', () => {
    let mockedOnSubmit = jest.fn();
    /*
    loginWrapper = mount(<Provider store={store}>
                            <HashRouter>
                              <ConnectedLogin {...loginProps} login={mockedOnSubmit}/>
                            </HashRouter>
                         </Provider>
    );
    */
    loginWrapper = shallow(<Login {...loginProps} login={mockedOnSubmit} />);
    //loginWrapper.handleSubmit();
    //store.dispatch(login('testuser', 'password'));
    //loginWrapper.find(Login).instance().handleSubmit = jest.fn();
    //loginWrapper.update();
    //loginWrapper.find(Login).instance().handleSubmit();
    //console.log(loginWrapper.find(Login).props());
    const button = loginWrapper.find('Button.px-4').first();
    var prevented;
    button.simulate('click', {
      preventDefault: () => {
        prevented = true;
      }
    });
    //action = store.getActions();
    expect(mockedOnSubmit.mock.calls.length).toBe(1);
  });

  it('test if login dispatch works', () => {
    let actions;
    store.dispatch(action.loginRequest());
    //Test if LOGIN_REQUEST is dispatched successfully

    store.dispatch(action.loginSuccess('testuser'));
    actions = store.getActions();
    expect(actions[0].type).toBe('LOGIN_REQUEST');
    expect(actions[1].type).toBe('LOGIN_SUCCESS');
  });
});
