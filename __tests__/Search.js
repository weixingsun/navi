'use strict'
import 'react-native'
import React from 'react'
import Home from '../src/v/Home';
import renderer from 'react-test-renderer';

function snapshotHome (props) {
    const tree = renderer.create(<Home {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
}

describe('testing search page', () => {
  beforeEach(()=>{
    //
  });
    it('search search: default: destination', () => {
        let props =null
        snapshotHome(props)
    });
	//
	it('search page: start', () => {
        let props =null
        snapshotHome(props)
    });
	it('search page: fast input', () => {
        let props = {
            start:'',
            dest: '',
            mode: 'driving',
        }
        snapshotHome(props)
    });
    it('search page: select place: dest', () => {
        let props = {
            place: 'College Park',
            lat:38.984942,
            lng:-76.942706,
            type:'Destination',
        }
        snapshotHome(props)
    });
    it('search page: select place: start', () => {
        let props = {
            place: 'College Park',
            lat:38.984942,
            lng:-76.942706,
            type:'Start',
        }
        snapshotHome(props)
    });
	
});