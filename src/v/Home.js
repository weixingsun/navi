import React from 'react';
import {Dimensions, ListView, Platform, StyleSheet, Text, TextInput, TouchableHighlight, View, } from "react-native";
import {Actions} from "react-native-router-flux";
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';
import styles from './Styles'
import Google from '../c/api/Google'
import Net from '../c/api/Net'
import Gps from '../c/api/Gps'
import Route from '../c/Route'
import Tools from '../c/Tools'
import PolylineUtil from '../c/api/Polyline'
import { Kohana } from 'react-native-textinput-effects';
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
        this.updateOnUI=false
    }
    /**
     * Entry for launching app
     */
    componentWillMount() {
        
        Gps.getLatLngNet((latlng)=>{
            latlng['from'] = 'net'
            this.setAddressByLatLng(latlng)
        })
        Gps.checkGps(navigator,(latlng)=>{ //success
            this.setAddressByLatLng(latlng)
        },(failed)=>{
            alert('Unable to get latlng from your device')
        })
        this.changeQueryIcon()
    }
    /**
     * Actions Entry
     * @param {JSON} nextProps new params passed in from Actions
     */
    componentWillReceiveProps(nextProps) {
        this.processNewProps(nextProps)
    }
    /**
     * Actions receiver: all user actions goes here
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
                markers:[this.state.start],
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
        if(props.place!=null){
            //place = {address,lat,lng,type}  type = ['Destination','Start']
            if(props.place.type==='Destination'){
                this.setState({
                    markers:[this.state.start,props.place],
                    dest:props.place,
                    steps:[],
                    mode:'',
                    region:{...this.state.region,latitude:props.place.lat,longitude:props.place.lng},
                })
                this.changeClearIcon()
                setTimeout(() =>  this.focusMap(['Start','Destination'], true), 500)
            }else if(props.place.type==='Start'){
                this.setState({
                    markers:[this.state.dest,props.place],
                    start:props.place,
                    steps:[],
                    mode:'',
                    //region:{...this.state.region,latitude:props.place.lat,longitude:props.place.lng},
                })
                setTimeout(() =>  this.focusMap(['Start','Destination'], true), 500)
            }
        }
    }
    /**
     * Action: when user route to a place: from start to destination,
     * @param {JSON} props = {
     *           start:{type,lat,lng,address},
     *           dest:{type,lat,lng,address},
     *           mode:[driving,transit,walking]
     *         }
     */
    checkRouteAction(props){
        if(props.route_result){
            this.renderRoute( props.route_result.mode, props.route_result.result )
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
                onPress={()=> Actions.refresh({clear:'all',route_result:null}) }
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
            renderRightButton: ()=> <Icon style={styles.home_right_icon} name={'search'} size={30} color={'#333'} onPress={()=> Actions.search({place_type:'Destination',my:this.state.my}) } accessible={true} accessibilityLabel={'SearchIcon'}  />,
            clear: 'restart',
        });
    }
    /**
     * Actions: focus current map to fit all markers
     * @param {null}
     */
    focusMap(markerIds, animated) {
        //console.log(`Markers received to populate map: ${markers}`);
        this.map.fitToSuppliedMarkers(markerIds, animated);
    }
    /**
     * Actions: focus current map to a place
     * @param {JSON} latlng
     */
    animateTo(latlng) {
        this.map.animateToRegion({...this.state.region,latitude:latlng.lat,longitude:latlng.lng});
    }
    /**
     * For init start marker, translate latlng to readable current place name, exec only once
     * Use google reverse geocoding API
     * @param {JSON} latlng, position data from GPS
     */
    setAddressByLatLng(latlng){
        if(this.state.my.lat && latlng['from'] == 'net') return //make sure network latlng not cover the real device gps
        Google.reverse_geocoding(latlng,(result)=>{
          this.setMyPosition(latlng,result)
        })
    }
    /**
     * Set my position, , exec only once
     * @param {JSON} latlng, coordinates from Gps/Net
     */
    setMyPosition(latlng,json){
        if(json.results){
            let my = {
                lat:latlng.latitude,
                lng:latlng.longitude,
                address: json.results[0].formatted_address,
            }
            let start = {
                lat:latlng.latitude,
                lng:latlng.longitude,
                address: json.results[0].formatted_address,
                type:'Start',
            }
            let myregion = {
                latitude:latlng.latitude,
                longitude:latlng.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            }
            this.setState({ 
                my:my,
                start:start,
                //region:myregion,
                markers:[start],
            })
            this.animateTo(my)
        }else{
            //alert('setMyPosition '+JSON.stringify(json))
        }
    }
    /**
     * Switch start destination values, also need switch marker names
     * @param {null}
     */
    switchStartDest(){
        let start = this.state.dest
        start.type='Start'
        let dest = this.state.start
        dest.type='Destination'
        let markers = [start,dest]
        this.setState({
            start,
            dest,
            markers,
            steps:[],
            mode:'',
        })
    }
    /**
     * UI render: after chosen a place, show two inputs fields under navbar, like google maps
     * @param {null} but using internal state.start & state.dest
     */
    renderStartDest(){
        if(this.state.dest.address){
            return (
                <View style={styles.inner_search}>
                    <View style={{flex:1}}>
                    <Kohana style={styles.search_input} label={'Start'} iconClass={Icon} iconName={'circle-o'} iconColor={'#f4d29a'} 
                      labelStyle={{ color: '#91627b' }} inputStyle={{ color: '#91627b' }} onFocus={()=>Actions.search({place_type:'Start',my:this.state.my})} value={this.state.start.address} />
                    <View style={styles.separator}/>
                    <Kohana style={styles.search_input} label={'Destination'} iconClass={Icon} iconName={'flag-o'} iconColor={'#f4d29a'} 
                      labelStyle={{ color: '#91627b' }} inputStyle={{ color: '#91627b' }} onFocus={()=>Actions.search({place_type:'Destination',my:this.state.my})} value={this.state.dest.address} />
                    </View>
                    <View style={styles.place_switch}>
                        <Icon name={'retweet'} size={30} onPress={this.switchStartDest.bind(this)}/>
                    </View>
                </View>
            )
        }
    }
    /**
     * UI render: after chosen a place, show place detail info on bottom, like google maps
     * @param {String} name of address
     */
    renderAddress(name){
        let firsthalf = name.substr(0,Tools.getMiddleIndex(name)).trim()
        let secondhalf = name.substr(Tools.getMiddleIndex(name)+1).trim()
        if(name.length<30) return <Text style={styles.address}>{name}</Text>
        else if(firsthalf.length<30) return (
            <View style={{marginTop:10}}>
                <Text style={styles.home_place_address}>{firsthalf}</Text>
                <Text style={styles.home_place_address}>{secondhalf}</Text>
            </View>)
        else{return (
            <View style={{marginTop:10}}>
                <Text style={styles.home_place_address}>{firsthalf.substr(0,Tools.getMiddleIndex(firsthalf))}</Text>
                  <Text style={styles.home_place_address}>{firsthalf.substr(Tools.getMiddleIndex(firsthalf)+1).trim()}</Text>
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
                        <View style={{flexDirection:'row',marginTop:10,}}>
                            <Icon style={{marginLeft:10}} name={'car'}  color={carColor} size={40} accessible={true} accessibilityLabel={'DrivingIcon'}
                                onPress={()=>Route.route( this.state.start, this.state.dest, 'driving')}
                            />
                            <Icon style={{marginLeft:30}} name={'bus'}  color={busColor} size={40} accessible={true} accessibilityLabel={'TransitIcon'} 
                                onPress={()=>Route.route( this.state.start, this.state.dest, 'transit')}
                            />
                            <Icon style={{marginLeft:32}} name={'male'} color={walkColor} size={40} accessible={true} accessibilityLabel={'WalkingIcon'} 
                                onPress={()=>Route.route( this.state.start, this.state.dest, 'walking')} 
                            />
                        </View>
                        {this.renderAddress(this.state.dest.address)}
                    </View>
                    <View style={{flex:1}} />
                    <View style={{alignItems:"flex-end",marginTop:10,marginRight:30,}}>
                        <Icon name={'play'} size={40} onPress={Route.startRouteMode} />
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
            let color = '#ff0000'
            if(marker.type==='Start') color = '#0000ff'
            return <MapView.Marker
                key={i}
                coordinate={{latitude:marker.lat, longitude:marker.lng}}
                //image={ placeIcon }
                onPress={ ()=> console.log('clicked '+marker.type) }
                identifier={marker.type}
                pinColor={color}
            />
        })
    }
    /**
     * Main render: 
     */
    render(){
        return (
        <View style={styles.container}>
            <MapView ref={ref => { this.map = ref; }} 
                style={styles.map}
                //region={this.state.region}
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
