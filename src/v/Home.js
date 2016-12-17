import React from 'react';
import {Dimensions, ListView, Platform, StyleSheet, Text, TextInput, TouchableHighlight, View, } from "react-native";
//import Button from "react-native-button";
import {Actions} from "react-native-router-flux";
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';
import Permissions from 'react-native-permissions';

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    listContainer: {
        flex: 1,
        flexDirection: 'column',
        marginTop:Platform.OS==='android'?54:64,
    },
	map: {
		position: 'absolute',
		top: 54,
		left: 0,
		right: 0,
		bottom: 0,
	},
    separator: {
        height: 1,
        backgroundColor: '#CCCCCC',
    },
	place: {
		position: 'absolute',
		top: 55,
		left: 0,
		right: 0,
		bottom: 0,
        //justifyContent: "flex-end",
        //alignItems: "center",
	},
	inner_place:{
		backgroundColor:'white',
		height:150,
		width:Dimensions.get('window').width,
	},
	inner_search:{
		backgroundColor:'white',
		height:90,
		width:Dimensions.get('window').width-60,
	},
	address:{
		fontWeight:'bold',
		fontSize:16,
		marginTop:5,
		marginLeft:30,
	},
	search_icon:{
		marginLeft:15,
		marginTop:10,
		marginRight:10,
	},
	search_input:{
		flex:1,
		height:45,
	},
});

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.ds= new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state={ 
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
        }
		this.updateOnUI=true
    }
    componentWillMount() {
        //this.addRunIcon()
		this.checkGpsPermission()
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.dest){
			this.setState({
				markers:[nextProps.dest],
				dest:nextProps.dest,
			})
        }
    }
	setStartAddressLatLng(latlng){
		return {
			lat:latlng.latitude,
			lng:latlng.longitude,
			address:'My Location',
		}
	}
	turnOnGps(){
        this.watchID = navigator.geolocation.watchPosition((position) => {
				//{timestamp,{coords:{speed,heading,accuracy,longitude,latitude,altitude}}}
				if(this.updateOnUI){
					let my = this.setStartAddressLatLng(position.coords)
					let temp = this.state.start.latitude ? this.state.start : my
					this.setState({
						my:   my,
						start:temp,
					})
				}
			},(error) => console.log(error.message),
			{enableHighAccuracy: false, timeout: 10000, maximumAge: 1000, distanceFilter:100},
        );
    }
    turnOffGps(){
        if(this.watchID==null) return
        navigator.geolocation.clearWatch(this.watchID);
    }
	componentWillUnmount() { 
		this.turnOffGps();
		this.updateOnUI=false
    }
	checkGpsPermission(){
		Permissions.getPermissionStatus('location').then(response => {
			//['authorized', 'denied', 'restricted', 'undetermined']
			//this.setState({ gpsPermission: response })
			//alert('gps='+response)
			if(response!=='authorized') this.askGpsPermission()
			else this.turnOnGps()
		});
	}
	askGpsPermission(){
		Permissions.requestPermission('location').then(response => {
			//['authorized', 'denied', 'restricted', 'undetermined']
			if(response==='authorized'){
				this.turnOnGps()
				this.setState({ gpsPermission: response })
			}
		});
	}
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
	renderStartDest(){
		if(this.state.dest.address){
			return (
				<View style={styles.inner_search}>
					<View style={{flexDirection:'row'}}>
						<Icon style={styles.search_icon} name={'circle-o'} size={20} onPress={()=>alert('start')} />
						<TextInput style={styles.search_input} onChangeText={(text) => this.setState({text})} value={this.state.start.address} />
					</View>
					<View style={{flexDirection:'row'}}>
						<Icon style={styles.search_icon} name={'flag-o'} size={20} onPress={()=>alert('dest')} />
						<TextInput style={styles.search_input} onChangeText={(text) => this.setState({text})} value={this.state.dest.address} />
					</View>
				</View>
			)
		}
	}
	renderView(){
		if(this.state.dest.address){
			return (
				<View style={styles.place}>
					{this.renderStartDest()}
					<View style={{flex:1}}/>
					{this.renderPlaceView()}
				</View>
			)
		}
	}
	renderPlaceView(){
		if(this.state.dest.address){
			return (
				<View style={styles.inner_place}>
					<View style={{flexDirection:'row',marginTop:15,}}>
						<Icon style={{marginLeft:30}} name={'car'} size={40} onPress={()=>alert('car')} />
						<Icon style={{marginLeft:30}} name={'bus'} size={40} onPress={()=>alert('bus')} />
						<Icon style={{marginLeft:35}} name={'male'} size={40} onPress={()=>alert('walk')} />
					</View>
					{this.renderAddress(this.state.dest.address)}
				</View>
			)
		}
	}
	getSecondCommaIndex(name){
		let arr = name.split(',')
		return arr[0].length+arr[1].length+1
	}
	renderAddress(name){
		//alert(this.getSecondCommaIndex(name))
		
		if(name.length<30) return <Text style={styles.address}>{name}</Text>
		else return (
		<View style={{marginTop:15}}>
			<Text style={styles.address}>{name.substr(0,this.getSecondCommaIndex(name))}</Text>
			<Text style={styles.address}>{name.substr(this.getSecondCommaIndex(name)+1).trim()}</Text>
		</View>
		)
	}
    render(){
		//alert(this.state.markers.length)
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
			</MapView>
			{this.renderView()}
		</View>
        );
    }
}
