'use strict'
import setup from '../jest_setup'

import 'react-native'
import React from 'react'
import Home from '../src/v/Home';
import renderer from 'react-test-renderer';

function snapshotHome(props) {
    const tree = renderer.create( <Home {...props}/> ).toJSON()
        expect(tree).toMatchSnapshot()
    }

    describe('testing home page: ', () => {
        beforeEach(() => {})

        //initial state, no operations
        it('launch', () => { //location enabled by default
            let props = null
            snapshotHome(props)
        });

        it('location denied', () => {
            let props = null
            global.Permissions.location = 'denied';
            snapshotHome(props)
        });
        it('mock gps for get init start', () => {
            let props = {
                place: {
                    lat: 38.984942,
                    lng: -76.942706,
                    //address:'My Location',
                    type: 'Start',
                },
            }
            snapshotHome(props)
        });
        //after search
        it('set dest', () => {
            let props = {
                place: {
                    address: 'College Park',
                    lat: 38.984942,
                    lng: -76.942706,
                    type: 'Destination',
                }
            }
            snapshotHome(props)
        });
        it('set start', () => {
            let props = {
                place: {
                    address: 'College Park',
                    lat: 38.984942,
                    lng: -76.942706,
                    type: 'Start',
                }
            }
            snapshotHome(props)
        });
        it('set dest long address', () => {
            let props = {
                place: {
                    address: 'The White House, 1600 Pennsylvania Ave NW, Washington, DC 20500, USA',
                    lat: 38.984942,
                    lng: -76.942706,
                    type: 'Destination',
                }
            }
            snapshotHome(props)
        });
        it('clear', () => {
            let props = {
                clear: 'all',
            }
            snapshotHome(props)
        });
        //render markers jest config failed: issue https://github.com/airbnb/react-native-maps/issues/829
        it('markers render check', () => {
            let props = {
                place: {
                    address: 'College Park',
                    lat: 38.984942,
                    lng: -76.942706,
                    type: 'Destination',
                }
            }
            snapshotHome(props)
        });
        //only compare snapshot
        it('place view render check', () => {
            let props = {
                place: {
                    address: 'College Park',
                    lat: 38.984942,
                    lng: -76.942706,
                    type: 'Destination',
                }
            }
            snapshotHome(props)
        });
        //route
        let route_json = {
            mode: 'driving',
            start: {
                address: 'College Park',
                lat: 38.989697,
                lng: -76.937760,
                type: 'Start',
            },
            dest: {
                address: 'The White House',
                lat: 38.897676,
                lng: -77.036530,
                type: 'Destination',
            }
        }
        it('route car', () => {
            let props = {
                route: route_json
            }
            snapshotHome(props)
        });
        it('route bus', () => {
            route_json.mode = 'transit'
            let props = {
                route: route_json
            }
            snapshotHome(props)
        });
        it('route walk', () => {
            route_json.mode = 'walking'
            let props = {
                route: route_json
            }
            snapshotHome(props)
        });
        it('route fail', () => {
            route_json.start = {
                address: 'fake place',
                lat: 0,
                lng: 0,
                type: 'Start',
            }
            let props = {
                route: route_json
            }
            snapshotHome(props)
        });
        //render routes jest config failed: issue https://github.com/airbnb/react-native-maps/issues/829
        it('route render check', () => {
            let props = {
                route: route_json
            }
            snapshotHome(props)
        });
    });