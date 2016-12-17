import React from 'react';
import {Dimensions, ListView, Platform, StyleSheet, Text, TextInput, TouchableHighlight, View, } from "react-native";
//import Button from "react-native-button";
import {Actions} from "react-native-router-flux";
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';
import Permissions from 'react-native-permissions';
import styles from './Styles'

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
					let temp = this.state.start.lat ? this.state.start : my
					alert('watchPosition my='+JSON.stringify(my)+' start='+JSON.stringify(temp))
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
	getSecondCommaIndex(name){
		let arr = name.split(',')
		return arr[0].length+arr[1].length+1
	}
	renderAddress(name){
		if(name.length<30) return <Text style={styles.address}>{name}</Text>
		else return (
		<View style={{marginTop:15}}>
			<Text style={styles.address}>{name.substr(0,this.getSecondCommaIndex(name))}</Text>
			<Text style={styles.address}>{name.substr(this.getSecondCommaIndex(name)+1).trim()}</Text>
			<Text>start={JSON.stringify(this.state.start)}</Text>
		</View>
		)
	}
	renderPlaceView(){
		if(this.state.dest.address){
			return (
				<View style={styles.inner_place}>
					<View style={{flexDirection:'row',marginTop:15,}}>
						<Icon style={{marginLeft:30}} name={'car'}  size={40} onPress={this.routeCar.bind(this)} />
						<Icon style={{marginLeft:30}} name={'bus'}  size={40} onPress={this.routeBus.bind(this)} />
						<Icon style={{marginLeft:35}} name={'male'} size={40} onPress={this.routeWalk.bind(this)} />
					</View>
					{this.renderAddress(this.state.dest.address)}
				</View>
			)
		}
	}
	routeCar(){
		alert('car from:'+JSON.stringify(this.state.start)+'\nto '+JSON.stringify(this.state.dest))
		let url = 'https://maps.googleapis.com/maps/api/directions/json?origin=Brooklyn&destination=Queens&key'
	}
	routeBus(){
		alert('bus from:'+JSON.stringify(this.state.start)+'\nto '+JSON.stringify(this.state.dest))
		let url = 'https://maps.googleapis.com/maps/api/directions/json?origin=Brooklyn&destination=Queens&mode=transit&key'
	}
	routeWalk(){
		alert('walk from:'+JSON.stringify(this.state.start)+'\nto '+JSON.stringify(this.state.dest))
		let url = 'https://maps.googleapis.com/maps/api/directions/json?origin=Brooklyn&destination=Queens&mode=walk&key'
	}
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
			</MapView>
			{this.renderView()}
		</View>
        );
    }
}
