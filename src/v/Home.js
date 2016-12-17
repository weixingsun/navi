import React from 'react';
import {Dimensions, ListView, Platform, StyleSheet, Text, TouchableHighlight, View, } from "react-native";
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
			dest:null,
			markers:[],
        }
    }
    componentWillMount() {
        //this.addRunIcon()
		this.checkGpsPermission()
    }
    componentWillReceiveProps(nextProps) {
		//console.log('componentWillReceiveProps == '+Object.keys(nextProps))
        if(nextProps.dest){
			//alert('dest='+JSON.stringify(nextProps.dest))
			this.setState({
				markers:[nextProps.dest],
				dest:nextProps.dest,
			})
        }
    }
	checkGpsPermission(){
		Permissions.getPermissionStatus('location').then(response => {
			//['authorized', 'denied', 'restricted', 'undetermined']
			//this.setState({ gpsPermission: response })
			//alert('gps='+response)
			if(response!=='authorized') this.askGpsPermission()
		});
	}
	askGpsPermission(){
		Permissions.requestPermission('location').then(response => {
			//returns once the user has chosen to 'allow' or to 'not allow' access
			//response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
			this.setState({ gpsPermission: response })
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
    render(){
		//alert(this.state.markers.length)
        return (
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
        );
    }
}
