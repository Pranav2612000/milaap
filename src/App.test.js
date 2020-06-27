import React from 'react';
import { shallow } from 'enzyme/build';
import App, { DefaultLayout, Login } from './App';
import { MemoryRouter } from 'react-router';
import { Route } from 'react-router-dom';
/*
import DefaultLayout from './containers/DefaultLayout/DefaultLayout';
import Login from './views/Pages/Login/Login';
*/

it('mounts without crashing', () => {
  const wrapper = shallow(<App />);
  wrapper.unmount();
});

let pathMap = {};
describe('routes using array of routers', () => {
  beforeAll(() => {
    const component = shallow(<App />);
    pathMap = component.find(Route).reduce((pathMap, route) => {
      const routeProps = route.props();
      pathMap[routeProps.path] = routeProps.component;
      return pathMap;
    }, {});
    console.log(pathMap);
  });
  it('should show Home component for / router (getting array of routes)', () => {
    expect(pathMap['/']).toBe(DefaultLayout);
  });
  it('should show News Feed component for /news router', () => {
    expect(pathMap['/login']).toBe(Login);
  });
  /*
    it('should show News Feed component techdomain for /news router', () => {
          expect(pathMap['/news/techdomain']).toBe(News);
        })
    it('should show No match component for route not defined', ()=>{
            expect(pathMap['undefined']).toBe(NoMatch);
        })
        */
});
