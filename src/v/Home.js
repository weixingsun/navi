import React from 'react';
import {Dimensions, ListView, Platform, StyleSheet, Text, TouchableHighlight, View, } from "react-native";
//import Button from "react-native-button";
import {Actions} from "react-native-router-flux";
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';

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
		top: 0,
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
				latitude: 39.0458,
				longitude: -76.6413,
				latitudeDelta: 0.1,
				longitudeDelta: 0.1,
			},
        }
    }
    componentWillMount() {
        //this.addRunIcon()
    }
    componentWillReceiveProps(nextProps) {
        //nextProps={onNavigate,navigationState,name,sceneKey,parent,type,title,initial,drawerIcon,component,index,file,from}
        //alert('componentWillReceiveProps: file'+JSON.stringify(nextProps.file))
        if(nextProps.file!==null){
            //this.readFile(nextProps.file);
        //}else if(nextProps.content){
        //    this.setState({content:nextProps.content})
        }
    }
    render(){
        return (
			<MapView style={styles.map}
				region={this.state.region}
				initialRegion={this.state.region}
				showsUserLocation={true}
              rotateEnabled={false}
			  showsCompass={true}
              showsScale={true}
			/>
        );
    }
}
