import React from 'react';
import {
    AsyncStorage,
    Platform,
    ListView,
    View,
    Text,
    TextInput,
    StyleSheet
} from "react-native";
import Button from "react-native-button";
import {
    Actions
} from "react-native-router-flux";
import Icon from 'react-native-vector-icons/FontAwesome';
//import SQLite from 'react-native-sqlite-storage'
import GooglePlace from '../c/api/GooglePlace';
import styles from './Styles'
import Google from '../c/api/Google'
/**
 * Search page
 * Using Google Suggestion API, abstracted in GooglePlace
 * Project: navi
 * Package: com.navi
 * Author: Weixing Sun on 2016-12-19 10:18
 * Email:  Weixing.Sun@Gmail.Com
 */
export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lines: [],
            dest: '',
            destLat: 0,
            destLng: 0,
            place_type: 'Destination',
            my:'38.984942,-76.942706',
        }
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }
    /**
     * Actions Entry
     * @param {String} place_type in ['Destination','Start']
     */
    componentWillMount() {
        //this.getHistoryDB('search_history',(v)=>alert(JSON.stringify(v)))
        //AsyncStorage.removeItem('search_history')
        let title_pre = 'Select a ' //will support i18n later
        if (this.props.place_type != null) {
            let my = this.props.my? this.props.my.lat+','+this.props.my.lng:this.state.my
            this.setState({
                place_type: this.props.place_type,
                my:my,
            })
        }
        // update title
        let title_suffix = this.props.place_type?this.props.place_type:this.state.place_type
        Actions.refresh({
            title: title_pre + title_suffix,
        });
    }
    componentWillReceiveProps(nextProps) {
    }
    /**
     * Get historical records from local DB
     * @param {String} key  stored key in db
     * @param {Function} func callback
     */
    getHistoryDB(key, func) {
        AsyncStorage.getItem(key).then((value) => {
            if (value) func(value)
                //else alert('history='+value)
        });
    }
    /**
     * Set historical search records from local DB
     * @param {JSON} json  new record in json
     */
    appendHistoryDB(json) {
        AsyncStorage.getItem('search_history').then((value) => {
            let arr = []
            if (value == null) {
                arr.push(json)
            } else {
                arr = JSON.parse(value)
                arr.push(json)
            }
            AsyncStorage.setItem('search_history', JSON.stringify(arr))
        })
    }
    /**
     * Render row of a single historical search record
     * @param {JSON} rowData  record in json
     */
    _renderRowView(rowData) {
        if (rowData == null) return
            //onPress={()=>this._onPress(rowData)}
        return (
            <TouchableHighlight underlayColor = '#c8c7cc' >
            <View >
                <View style = {{flexDirection: 'row',justifyContent: 'center',height: 30,}} >
                    <Text key = {i} style = {{fontSize: 12,margin: 5}}> 
                    {rowData[key]} 
                    </Text> 
                </View>
                <View style = {styles.separator}/>
            </View>
            </TouchableHighlight>
        );
    }
    /**
     * Action: user select a place from suggestion search result
     * @param {JSON} json  user selected place
     */
    setPlaceInfo(json) {
        //this.appendHistoryDB(json);
        Actions.pop({ 
            refresh: { 
                place: json,  //new place
                route: null,  //clear previous route if have one
        }})
    }
    /**
     * Main render
     */
    render() {
        return (
            <View style = {styles.map} >
            <View style = {styles.section} >
            <GooglePlace placeholder = 'powered by Google' //required by Google
            minLength = {1} // minimum length of text to search
            autoFocus = {true }
            fetchDetails = {true} //for getting latlng, compatible with other map providers
            onPress = {
                (data, details = {}) => { // details is provided when fetchDetails = true
                    let place_latlng = {
                        type: this.state.place_type,
                        address: data.description,
                        lat: details.geometry.location.lat,
                        lng: details.geometry.location.lng,
                        //type:details.types,
                    }
                    this.setPlaceInfo(place_latlng)
                }
            }
            name = {'dest'}
            value = {this.state.dest}
            query = {{
                key: Google.key,
                location: this.state.my, //this.state.pos.latitude+','+this.state.pos.longitude,
                radius: 5000,
                //components: {
                //    country: 'US'
                //},
            }}
            styles = {{
                description: {
                    //fontWeight: 'bold',
                    fontSize: 12,
                },
                predefinedPlacesDescription: {
                    color: '#1faadb',
                },
            }}
            currentLocation = {true} // Will add a 'Current location' button at the top of the predefined places list
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
            </View>
            </View>
        );
        /*
            <View style={styles.title}>
                    <Text style={styles.small_title_name}>{this.state.place_type}</Text>
            </View>
            <View style={styles.section}>
                    <ListView style={styles.listContainer}
                        dataSource={this.ds.cloneWithRows(this.state.lines)}
                        renderRow={this._renderRowView.bind(this)}
                        enableEmptySections={true}
                    />
            </View>
        */
    }
}