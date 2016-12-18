import Net from './Net'
module.exports = {
	key:'AIzaSyApl-_heZUCRD6bJ5TltYPn4gcSCy1LY3A',
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
				console.log('GoogleDirection='+url)
				func(rst)
			})
		}
    },
	reverse_geocoding(latlng,func){
		if(latlng.latitude && latlng.longitude){
			let url = 'https://maps.googleapis.com/maps/api/geocode/json'
			+'?latlng='+latlng.latitude+','+latlng.longitude
			+'&key='+this.key
			Net._get(url).then((rst)=>{
				func(rst)
			})
		}
    },
}