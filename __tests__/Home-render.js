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

function snapshotHome (props) {
    const tree = renderer.create(<Home {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
}

describe('testing home page', () => {
  beforeEach(()=>{
    //
  });
    it('home page: launch', () => {
        let props =null
        snapshotHome(props)
    });
    it('home page: dest', () => {
        let props = {
            place: 'College Park',
            lat:38.984942,
            lng:-76.942706,
            type:'Destination',
        }
        snapshotHome(props)
    });
    it('home page: start', () => {
        let props = {
            place: 'College Park',
            lat:38.984942,
            lng:-76.942706,
            type:'Start',
        }
        snapshotHome(props)
    });
    it('home page: clear', () => {
        let props = {
            clear: true,
        }
        snapshotHome(props)
    });
    it('home page: route car', () => {
        let props = {
            start:'',
            dest: '',
            mode: 'driving',
        }
        snapshotHome(props)
    });
    it('home page: route bus', () => {
        let props = {
            start:'',
            dest: '',
            mode: 'transit',
        }
        snapshotHome(props)
    });
    it('home page: route walk', () => {
        let props = {
            start:'',
            dest: '',
            mode: 'walking',
        }
        snapshotHome(props)
    });
});

