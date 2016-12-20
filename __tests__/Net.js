'use strict'
const Net = require('../src/api/Net');
let mock_get_geoip = {"ip":"12.60.75.65","country_code":"US","country_name":"United States","region_code":"NJ","region_name":"New Jersey","city":"Middletown Township","zip_code":"07748","time_zone":"America/New_York","latitude":40.3965,"longitude":-74.1075,"metro_code":501}
describe('Net', () => {
  it('.get', () => {
    Net._get("http://freegeoip.net/json/12.60.75.65").then(json => expect(json).toEqual(mock_get_geoip));
  });
  /*it('.post', () => {
	return Net.get("").then(json => expect(json).toEqual('Paul'));
  });
  it('.put', () => {
	return Net.get("").then(json => expect(json).toEqual('Paul'));
  });
  it('.delete', () => {
	return Net.get("").then(json => expect(json).toEqual('Paul'));
  });*/
});
