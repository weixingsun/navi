import {Dimensions, ListView, Platform, StyleSheet, Text, TextInput, TouchableHighlight, View, } from "react-native";
module.exports = {

	section:{
		//flex: 1,
		justifyContent: 'center',
		//alignItems: 'center',
		flexDirection:'row',
	},
	title:{
		//backgroundColor:'#eeeeee',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 6,
	},
	title_name:{
		fontWeight:'bold',
		fontSize:20,
	},
	
    container: {
        flex: 1,
        //justifyContent: "center",
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
		//flex:1,
		flexDirection:'row',
		backgroundColor:'white',
		height:150,
		//width:Dimensions.get('window').width,
	},
	inner_search:{
		backgroundColor:'white',
		height:90,
		//width:Dimensions.get('window').width-60,
		marginLeft:2,
		marginRight:60,
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
	home_right_icon:{
		marginRight:15,
		marginBottom:5,
	},
};