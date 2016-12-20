'use strict'
import setup from '../jest_setup'

import 'react-native'
import React from 'react'
import Search from '../src/v/Search';
import renderer from 'react-test-renderer';

function snapshotSearch(props) {
    const tree = renderer.create( <Search {...props}/> ).toJSON()
        expect(tree).toMatchSnapshot()
    }

    describe('testing search page', () => {
        beforeEach(() => {});
        it('search search: default: destination', () => {
            let props = null
            snapshotSearch(props)
        });
        //
        it('search page: start', () => {
            let props = {
                place_type: 'Start'
            }
            snapshotSearch(props)
        });
        //appium is better for testing operations
        //move to google
        /*it('search page: fast input', () => {
        let props = null
        snapshotSearch(props)
    });
    it('search page: select place: dest', () => {
        let props = {
            address: 'College Park',
            lat:38.984942,
            lng:-76.942706,
            type:'Destination',
        }
        snapshotSearch(props)
    });
    it('search page: select place: start', () => {
        let props = {
            address: 'College Park',
            lat:38.984942,
            lng:-76.942706,
            type:'Start',
        }
        snapshotSearch(props)
    });*/

    });