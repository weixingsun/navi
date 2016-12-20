/**
 * Includes all API calls of Google
 * Project: navi
 * Package: com.navi
 * Author: Weixing Sun on 2016-12-19 20:04
 * Email:  Weixing.Sun@Gmail.Com
 */
import Net from './Net'
module.exports = {
	key:'AIzaSyApl-_heZUCRD6bJ5TltYPn4gcSCy1LY3A',
	/**
	 * route api
	 * @param {JSON} start, {address,lat,lng,type}
	 * @param {JSON} dest, {address,lat,lng,type}
	 * @param {String} mode, [driving,transit,walking]
	 * @param {Function} func, callback function to actions/pages
	 */
	route(start,dest,mode,func){
		if(start.address && dest.address){
			//let startStr=start.lat+','+start.lng
			//let destStr=dest.lat+','+dest.lng
			let url = 'https://maps.googleapis.com/maps/api/directions/json'
			+'?origin='+start.address
			+'&destination='+dest.address
			+'&mode='+mode
			+'&key='+this.key
			+'&units=metric'  //imperial
			//+'&alternatives=true'
			Net._get(url).then((rst)=>{
				func(rst)
			})
		}
    },
	/**
	 * reverse geocoding api
	 * @param {JSON} latlng, {latitude,longitude}
	 * @param {Function} func, callback function to actions/pages
	 */
	reverse_geocoding(latlng,func){
		if(latlng.latitude && latlng.longitude){
			let url = 'https://maps.googleapis.com/maps/api/geocode/json'
			+'?latlng='+latlng.latitude+','+latlng.longitude
			+'&key='+this.key
			//console.log('reverse_geocoding='+url)
			Net._get(url).then((rst)=>{
				//console.log('reverse_geocoding='+rst.results[0].formatted_address)
				func(rst)
			})
		}
    },
}