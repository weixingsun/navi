import React from 'react';
import {Dimensions, ListView, Platform, StyleSheet, Text, TextInput, TouchableHighlight, View, } from "react-native";
import {Actions} from "react-native-router-flux";
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';
import Permissions from 'react-native-permissions';
import styles from './Styles'
import Google from '../c/api/Google'
import PolylineUtil from '../c/api/Polyline'
/**
 * Home page
 * Project: navi
 * Package: com.navi
 * Author: Weixing Sun on 2016-12-19 10:18
 * Email:  Weixing.Sun@Gmail.Com
 */
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.ds= new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state={
            //use UMD as initial place
            region:{
                latitude: 38.984942,
                longitude: -76.942706,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            },
            my:{},
            start:{},
            dest:{},
            markers:[],
            steps:[],
            duration:'',
            distance:'',
            mode:'',
        }
        this.updateOnUI=true
    }
    /**
     * Cleaning GPS and UI update switch
     */
    componentWillUnmount() { 
        this.turnOffGps();
        this.updateOnUI=false
    }
    /**
     * Entry for launching app
     */
    componentWillMount() {
        this.checkGpsPermission()
    }
    /**
     * Actions Entry
     * @param {JSON} nextProps new params passed in from Actions
     */
    componentWillReceiveProps(nextProps) {
        this.processNewProps(nextProps)
    }
    /**
     * Actions switch: all user actions goes here
     * @param {JSON} nextProps in types of [clear,place,route]
     */
    processNewProps(nextProps){
        this.checkClearAction(nextProps)
        this.checkPlaceAction(nextProps)
        this.checkRouteAction(nextProps)
    }
    /**
     * Action: when user click on clear icon
     * @param {JSON} props = {clear}
     */
    checkClearAction(props){
        if(props.clear==='all'){
            this.changeQueryIcon()
            this.setState({
                dest:{},
                markers:[],
                steps:[],
                mode:'',
            })
        }
    }
    /**
     * Action: when user chosen a place: start & destination
     * @param {JSON} props = {
     *           place:{type,lat,lng,address}
     *         }
     */
    checkPlaceAction(props){
        if(props.place!==null){
            //place = {address,lat,lng,type}  type = ['Destination','Start']
            if(props.place.type==='Destination'){
                this.setState({
                    markers:[props.place],
                    dest:props.place,
                    region:{...this.state.region,latitude:props.place.lat,longitude:props.place.lng},
                })
                this.changeClearIcon()
            }else if(props.place.type==='Start'){
                this.setState({
                    //markers:[props.dest],
                    start:props.place,
                    steps:[],
                    mode:'',
                    //region:{...this.state.region,latitude:props.place.lat,longitude:props.place.lng},
                })
            }
        }
    }
    /**
     * Action: when user route to a place: from start to destination, will extract into Tool/API class
     * @param {JSON} props = {
     *           start:{type,lat,lng,address},
     *           dest:{type,lat,lng,address},
     *           mode:[driving,transit,walking]
     *         }
     */
    checkRouteAction(props){
        if(props.route){
            let r = props.route   // {start,dest,mode}  // mode=[driving,transit,walking]
            Google.route(r.start,r.dest,r.mode,(result)=>{
                this.renderRoute(r.mode,result)
            })
        }
    }
    /**
     * UI change: up right corner icon, when user chosen a place
     * @param {null}
     */
    changeClearIcon(){
        Actions.refresh({
            renderRightButton: ()=> <Icon 
                style={styles.home_right_icon} 
                name={'times'} 
                size={30} 
                color={'#333'}
                onPress={()=> Actions.refresh({clear:'all',route:null}) }
                accessible={true} accessibilityLabel={'ClearIcon'} 
                />,
            place: null, //this is only ui change, not to circular bother action entry
        });
    }
    /**
     * UI change: up right corner icon, when user release a place
     * @param {null}
     */
    changeQueryIcon(){
        Actions.refresh({
            renderRightButton: ()=> <Icon style={styles.home_right_icon} name={'search'} size={30} color={'#333'} onPress={()=> Actions.search() } accessible={true} accessibilityLabel={'SearchIcon'}  />,
            clear: 'restart',
        });
    }
    /**
     * For updating UI, translate gps latlng to readable current place name, exec only once
	 * Use google reverse geocoding API
     * @param {JSON} latlng, position data from GPS
     */
    setStartAddressLatLng(latlng){
        Google.reverse_geocoding(latlng,(result)=>{
          if(result){
            let results = result.results
            let my = {
                lat:latlng.latitude,
                lng:latlng.longitude,
                address: results[0].formatted_address,
            }
			let myregion = {
                latitude:latlng.latitude,
                longitude:latlng.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
			}
            this.setState({ my:my,start:my,region:myregion })
          }
        })
    }
    /**
     * GPS switch on
     */
    turnOnGps(){
        this.watchID = navigator.geolocation.watchPosition((position) => {
            //{timestamp,{coords:{speed,heading,accuracy,longitude,latitude,altitude}}}
            if(this.updateOnUI){
                this.setStartAddressLatLng(position.coords)
            }
            this.turnOffGps()
        },(error) => console.log(error.message),
            {enableHighAccuracy: false, timeout: 10000, maximumAge: 5000, distanceFilter:100},
        );
    }
    /**
     * GPS switch off
     */
    turnOffGps(){
        if(this.watchID==null) return
        navigator.geolocation.clearWatch(this.watchID);
    }
    /**
     * Permission checker, works for both android/ios
	 * refer to: react-native-permissions
     */
    checkGpsPermission(){
        Permissions.getPermissionStatus('location').then(response => {
            //['authorized', 'denied', 'restricted', 'undetermined']
            if(response!=='authorized') this.askGpsPermission()
            else this.turnOnGps()
        });
    }
    /**
     * Request GPS permission, works for both android/ios
	 * refer to: react-native-permissions
     */
    askGpsPermission(){
        Permissions.requestPermission('location').then(response => {
            //['authorized', 'denied', 'restricted', 'undetermined']
            if(response==='authorized'){
                this.turnOnGps()
                this.setState({ gpsPermission: response })
            }
        });
    }
    /**
     * UI render: after chosen a place, show two inputs fields under navbar, like google maps
     * @param {null} but using internal state.start & state.dest
     */
    renderStartDest(){
        if(this.state.dest.address){
            return (
                <View style={styles.inner_search}>
                    <View style={{flexDirection:'row'}}>
                        <Icon style={styles.search_icon} name={'circle-o'} size={20} onPress={()=>{}} />
                        <TextInput style={styles.search_input} onChangeText={(text) => this.setState({text})} value={this.state.start.address} onFocus={()=>Actions.search({place_type:'Start'})} />
                    </View>
                    <View style={styles.separator}/>
                    <View style={{flexDirection:'row'}}>
                        <Icon style={styles.search_icon} name={'flag-o'} size={20} onPress={()=>{}} />
                        <TextInput style={styles.search_input} onChangeText={(text) => this.setState({text})} value={this.state.dest.address} onFocus={Actions.search} />
                    </View>
                </View>
            )
        }
    }
    /**
     * Tools: for spliting address name into several lines, will extract to tools class later
     * @param {String} address name
	 * @return {Number} the "," index in middle of address
     */
    getMiddleIndex(name){
        let arr = name.split(',')
        let half = arr.length/2
        arr = arr.slice(0, half);
        return arr.join(',').length
    }
    /**
     * UI render: after chosen a place, show place detail info on bottom, like google maps
     * @param {String} name of address
     */
    renderAddress(name){
        let firsthalf = name.substr(0,this.getMiddleIndex(name)).trim()
        let secondhalf = name.substr(this.getMiddleIndex(name)+1).trim()
        if(name.length<30) return <Text style={styles.address}>{name}</Text>
        else if(firsthalf.length<30) return (
            <View style={{marginTop:15}}>
                <Text style={styles.home_place_address}>{firsthalf}</Text>
                <Text style={styles.home_place_address}>{secondhalf}</Text>
            </View>)
        else{return (
            <View style={{marginTop:15}}>
                <Text style={styles.home_place_address}>{firsthalf.substr(0,this.getMiddleIndex(firsthalf))}</Text>
                  <Text style={styles.home_place_address}>{firsthalf.substr(this.getMiddleIndex(firsthalf)+1).trim()}</Text>
                <Text style={styles.home_place_address}>{secondhalf}</Text>
            </View>)
        }
    }
    /**
     * UI render: after chosen a place, show place detail info on bottom, like google maps
     * @param {null} but using internal state.start,dest,mode,distance,duration
     */
    renderPlaceView(){
        if(this.state.dest.address){
            let carColor = this.getIconColor('driving',this.state.mode)
            let busColor = this.getIconColor('transit',this.state.mode)
            let walkColor = this.getIconColor('walking',this.state.mode)
            return (
                <View style={styles.inner_place}>
                    <View>
                        <View style={{flexDirection:'row',marginTop:15,}}>
                            <Icon style={{marginLeft:10}} name={'car'}  color={carColor} size={40} onPress={this.routeCar.bind(this)} accessible={true} accessibilityLabel={'DrivingIcon'} />
                            <Icon style={{marginLeft:30}} name={'bus'}  color={busColor} size={40} onPress={this.routeBus.bind(this)} accessible={true} accessibilityLabel={'TransitIcon'} />
                            <Icon style={{marginLeft:32}} name={'male'} color={walkColor} size={40} onPress={this.routeWalk.bind(this)} accessible={true} accessibilityLabel={'WalkingIcon'} />
                        </View>
                        {this.renderAddress(this.state.dest.address)}
                    </View>
                    <View style={{flex:1}} />
                    <View style={{alignItems:"flex-end",marginTop:15,marginRight:30,}}>
                        <Icon name={'play'} size={40} onPress={this.startRoute.bind(this)} />
                        <Text> </Text>
                        <Text>{this.state.distance}</Text>
                        <Text>{this.state.duration}</Text>
                    </View>
                </View>
            )
        }
    }
    /**
     * UI change: get predefined route color for selected mode: in src/v/Styles
     * @param {String} name  1/3 types: [driving,transit,walking]
     * @param {String} current_mode
     */
    getIconColor(name,current_mode){
        if(name==current_mode){
            return styles[current_mode].color
        } else {
            return 'gray'
        }
    }
    /**
     * Action: for navigation mode, fake it for now
     * @param {null}
     */
    startRoute(){
        alert('start routing')
    }
    /**
     * Action switch: for driving route, will merge three route functions into 1
     * @param {null} but using internal state
     */
    routeCar(){
        Actions.refresh({
            route: {
                start:this.state.start,
                dest: this.state.dest,
                mode: 'driving',
            }
        })
    }
    /**
     * Action switch: for transit route, will merge three route functions into 1
     * @param {null} but using internal state
     */
    routeBus(){
        Actions.refresh({
            route: {
                start:this.state.start,
                dest: this.state.dest,
                mode: 'transit',
            }
        })
    }
    /**
     * Action switch: for walking route, will merge three route functions into 1
     * @param {null} but using internal state
     */
    routeWalk(){
        Actions.refresh({
            route: {
                start:this.state.start,
                dest: this.state.dest,
                mode: 'walking',
            }
        })
    }
    /**
     * UI change: after all three route modes
     * @param {String} mode: [driving,transit,walking]
     * @param {JSON} routeJson, result from google direction api
     */
    renderRoute(mode,routeJson){
		//check if route success
        if(routeJson.routes.length>0){
            let distance = routeJson.routes[0].legs[0].distance.text
            let duration = routeJson.routes[0].legs[0].duration.text
            let steps    = routeJson.routes[0].legs[0].steps
            let ne = routeJson.routes[0].bounds.northeast
            let sw = routeJson.routes[0].bounds.southwest
            let latDelta = Math.abs(ne.lat - sw.lat)
            let lngDelta = Math.abs(ne.lng - sw.lng)
            let region = {
                latitude: (ne.lat+sw.lat)/2,
                longitude: (ne.lng+sw.lng)/2,
                latitudeDelta: latDelta*1.4,
                longitudeDelta:lngDelta*1.4,
            }
            this.setState({ distance,duration,steps,mode,region })
        }else{
            alert('route failed: '+routeJson.error_message)
        }
    }
    /**
     * UI render: draw polylines after route actions
     * @param {null} but using internal state.steps
     */
    renderPolylines(){
        let polylines = this.state.steps.map((step,i)=>{
            let pls = PolylineUtil.decode(step.polyline.points);
            return <MapView.Polyline
                key={i}
                coordinates={pls}
                strokeWidth={styles[this.state.mode].width}
                strokeColor={styles[this.state.mode].color}
                lineCap={'round'}
                lineJoin={'round'}
                //onPress={()=>alert(JSON.stringify(step))}
            />
        })
        return polylines
    }
    /**
     * UI render: draw markers after user selected a place
     * @param {null} but using internal state.markers
     */
    renderMarkers(){
        return this.state.markers.map((marker,i)=>{
            return <MapView.Marker
                key={i}
                coordinate={{latitude:marker.lat, longitude:marker.lng}}
                //image={ placeIcon }
                //onPress={ ()=> this.showMsgByKey(key) }
                pinColor={'#ff0000'}
            />
        })
    }
    /**
     * Main render: 
     */
    render(){
        return (
        <View style={styles.container}>
            <MapView style={styles.map}
                region={this.state.region}
                initialRegion={this.state.region}
                showsUserLocation={true}
                rotateEnabled={false}
                showsCompass={true}
                showsScale={true}
            >
            {this.renderMarkers()}
            {this.renderPolylines()}
            </MapView>
            {this.renderStartDest()}
            {this.renderPlaceView()}
        </View>
        );
    }
}
