import React from 'react';
import {AsyncStorage, Platform, ListView, View, Text, TextInput, StyleSheet} from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";
import Icon from 'react-native-vector-icons/FontAwesome';
//import SQLite from 'react-native-sqlite-storage'
import GooglePlace from '../api/GooglePlace';
import styles from './Styles'
import Google from '../api/Google'

export default class FunctionEdit extends React.Component {
	constructor(props) {
        super(props);
        this.state={
			lines:[],
			dest:'',
			destLat:0,
			destLng:0,
        }
		this.ds= new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }
	componentWillMount(){
		//this.getHistoryDB('search_history',(v)=>alert(JSON.stringify(v)))
		//AsyncStorage.removeItem('search_history')
		//this.setState({ lines:JSON.parse(value) });
    }
	getHistoryDB(name,func){
		AsyncStorage.getItem(name).then((value)=>{
			if(value) func(value)
			//else alert('history='+value)
		});
	}
	setHistoryDB(name,value){
		AsyncStorage.setItem(name,value)
	}
	appendHistoryDB(json){
		AsyncStorage.getItem('search_history').then((value)=>{
			let arr = []
			if(value==null) {
				arr.push(json)
			}else{
				arr = JSON.parse(value)
				arr.push(json)
			}
			//alert(JSON.stringify(arr))
			AsyncStorage.setItem('search_history',JSON.stringify(arr))
		})
	}
	_renderRowView(rowData) {
		if(rowData==null) return
		//onPress={()=>this._onPress(rowData)}
		return (
		<TouchableHighlight underlayColor='#c8c7cc'  >
			<View>
				<View style={{flexDirection:'row',justifyContent:'center',height:30,}}>
					<Text key={i} style={{fontSize:12,margin:5}}>{rowData[key]}</Text>
				</View>
				<View style={styles.separator} />
			</View>
		 </TouchableHighlight>
		);
	}
	setDestination(json){
		this.setState({
			dest:json.address,
			destLat:json.lat,
			destLng:json.lng,
		});
		this.appendHistoryDB(json);
		//alert('data='+JSON.stringify(json))
		//this.updateActionIcon(json)
		Actions.pop({refresh:{dest: json}})
	}
	updateActionIcon(json){
		if(json.address){
			Actions.refresh({
				key:'search',
				renderRightButton: ()=> <Icon name={'play'} size={20} color={'#333'} onPress={()=> Actions.pop({refresh:{dest: json}})}/>
			})
		}
	}
    render(){
        return (
            <View style={styles.map}>
				<View style={styles.section}>
					<View style={styles.title}>
						<Text style={styles.title_name}>Destination</Text>
					</View>
					<GooglePlace
						placeholder='powered by Google'  //required by Google
						minLength={1} // minimum length of text to search
						autoFocus={false}
						fetchDetails={true}		//for getting latlng
						onPress={(data, details = {}) => { // details is provided when fetchDetails = true
							let dest_latlng = {
								address: data.description,
								lat:details.geometry.location.lat,
								lng:details.geometry.location.lng,
								//type:details.types,
							}
							this.setDestination(dest_latlng)
						}}
						name = {'dest'}
						value= { this.state.dest }
						query={{
							key:Google.key,
							location:'38.984942,-76.942706', //this.state.pos.latitude+','+this.state.pos.longitude,
							radius:5000,
							components:{country:'US'},
						}}
						styles={{
						  description: {
							//fontWeight: 'bold',
							fontSize:12,
						  },
						  predefinedPlacesDescription: {
							color: '#1faadb',
						  },
						}}
						currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
						//currentLocationLabel="Current location"
						//currentLocationAPI='GoogleReverseGeocoding' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
						//GoogleReverseGeocodingQuery={{
						  // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
						//}}
						//GooglePlacesSearchQuery={{
						  // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
						  // rankby: 'distance',
						  //types: 'food',
						//}}
						//filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
						// predefinedPlaces={[everywhere]}
						//{...this.props} // @todo test sans (need for 'name')
					  />
					<View style={styles.section}>
						<ListView style={styles.listContainer}
							dataSource={this.ds.cloneWithRows(this.state.lines)}
							renderRow={this._renderRowView.bind(this)}
							enableEmptySections={true}
						/>
					</View>
				</View>
            </View>
        );
    }
}
