/**
 * Route: Includes all gps actions here
 * Project: navi
 * Package: com.navi
 * Author: Weixing Sun on 2016-12-19 10:20
 * Email:  Weixing.Sun@Gmail.Com
 */
import {Actions} from "react-native-router-flux";
import Net from './Net'
import Permissions from 'react-native-permissions';

import LocationServiceDialogBox from 'react-native-android-location-services-dialog-box'

module.exports = {
	watchID:null,
    /**
     * GPS switch off
     */
    turnOffGpsWatch(){
        if(this.watchID==null) return
        navigator.geolocation.clearWatch(this.watchID);
    },
	
    /**
     * For init start marker, translate net latlng to readable current place name, exec only once
     * @param {JSON} latlng, position data from GPS
     */
    getLatLngNet(success){
        Net.getNetLatLng((latlng)=>{
            //this.setAddressByLatLng(latlng)
			success(latlng)
        })
    },
    /**
     * Main checker, works for both android/ios
     * refer to: react-native-permissions
     */
    checkGps(navigator,success,failed){
        Permissions.getPermissionStatus('location').then(response => {
            //['authorized', 'denied', 'restricted', 'undetermined']
            if(response!=='authorized'){
                this.askGpsPermission(navigator,success)
            }else{
                this.turnOnGps(navigator,success)
            }
        }).catch(error=>{
			console.log('check gps error '+JSON.stringify(error))
			failed()});
    },
    /**
     * Open Gps dialog of system settings
     * @param {null}
     */
    enableGpsDialog(navigator,success){
        LocationServiceDialogBox.checkLocationServicesIsEnabled({
            message:'<h2>Location service disabled</h2>This app want to use your location',
            ok:'Yes',
            cancel:'No',
        })
		.then((good)=> this.turnOnGps(navigator,success))
		.catch((reject)=>{})
    },
    /**
     * GPS switch on
     */
    turnOnGps(navigator,success){
		//console.log('gps.getCurrentPosition')
        navigator.geolocation.getCurrentPosition((position) => {
        //this.watchID = navigator.geolocation.watchPosition((position) => {
            //{timestamp,{coords:{speed,heading,accuracy,longitude,latitude,altitude}}}
			//alert('got latlng from gps')
            success(position.coords)
            //this.turnOffGpsWatch()
        },(error) => {
			//only if no location provider available {code,message}
            if(error.code===1) this.enableGpsDialog(navigator,success)
            //else alert(JSON.stringify(error))
        },{enableHighAccuracy: true, timeout: 10000, maximumAge: 5000, distanceFilter:100},
        );
    },
    /**
     * Request GPS permission if permission not granted, works for both android/ios
     * refer to: react-native-permissions
     */
    askGpsPermission(navigator,success){
        Permissions.requestPermission('location').then(response => {
            //['authorized', 'denied', 'restricted', 'undetermined']
            if(response==='authorized'){
                this.turnOnGps(navigator,success)
                //this.setState({ gpsPermission: response })
            }
        }).catch(error=>alert('Request GPS permission failed'));
    },
}