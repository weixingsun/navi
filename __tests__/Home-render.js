'use strict'
jest.mock('react-native-permissions',()=>{
  const permissions = require.requireActual('react-native-permissions')
  permissions.getPermissionStatus= function(name){
    return new Promise(resolve => 'authorized')
  }
  return permissions
})
jest.mock('react-native-maps', () => {
  const React = require('React')
  return class MockMapView extends React.Component {
    static Marker = props => React.createElement('Marker', props, props.children);
    static propTypes = { children: React.PropTypes.any };

    render() {
      return React.createElement('MapView', this.props, this.props.children);
    }
  }
});

import 'react-native'
import React from 'react'
import Home from '../src/v/Home';
import renderer from 'react-test-renderer';

describe('renders correctly', () => {
  beforeEach(()=>{
    //Home.componentWillMount = emptyFunc
  });
    it('on visible=true', () => {
        const latlng = {
            latitude: 52.5166667,
            longitude: 13.4,
        };
        const color = '#ace';

        const component = (
            <Home />
        );

        const tree = renderer.create(component).toJSON();

        expect(tree).toMatchSnapshot();
    });
});

/*it('renders home page correctly', () => {
  const tree = renderer.create(
    <Home />
  );
})*/
