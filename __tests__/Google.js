'use strict'
const Google = require('../src/api/Google');
let mylatlng = {latitude:-43.714224, longitude:172.061452}
let mocked_address = "185 Breadings Rd, Bankside 7783, New Zealand"
let mocked_driving_distance = 25827
let mocked_transit_distance = 19103
let mocked_walking_distance = 15091
//const Net = require('../src/api/Net');
describe('Google', () => {
  it('.reverse_geocoding', () => {
    Google.reverse_geocoding(mylatlng,(json)=>{
		let actual = json.results[0].formatted_address
		expect(actual).toEqual(mocked_address);
	})
	//.then(json => expect(json).toEqual('Paul'));
  });
  it('.route driving', () => {
	  let start = {address:'College Park'}
	  let dest = {address:'The White House'}
	return Google.route(start,dest,'driving',(json)=>{
		let actual = json.routes[0].legs[0].distance.value
		expect(actual).toEqual(mocked_driving_distance);
	})
	//.then(json => expect(json).toEqual('Paul'));
  });
  it('.route transit', () => {
	  let start = {address:'College Park'}
	  let dest = {address:'The White House'}
	return Google.route(start,dest,'transit',(json)=>{
		let actual = json.routes[0].legs[0].distance.value
		expect(actual).toEqual(mocked_transit_distance);
	})
	//.then(json => expect(json).toEqual('Paul'));
  });
  it('.route walking', () => {
	  let start = {address:'College Park'}
	  let dest = {address:'The White House'}
	return Google.route(start,dest,'walking',(json)=>{
		let actual = json.routes[0].legs[0].distance.value
		expect(actual).toEqual(mocked_walking_distance);
	})
	//.then(json => expect(json).toEqual('Paul'));
  });
});
