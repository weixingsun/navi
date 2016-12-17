import React from 'react';
import {AsyncStorage, Dimensions, ListView, Platform, StyleSheet, Text, TouchableHighlight, View, } from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";
import RNFS from 'react-native-fs';
//import SQLite from 'react-native-sqlite-storage'
import alasql from '../sql/alasql.fs';
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
        marginTop:Platform.select({
			ios: 64,
			android: 54,
		}),
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5,
    },
	separator: {
		height: 1,
		backgroundColor: '#CCCCCC',
	},
});

export default class Result extends React.Component {
	constructor(props) {
        super(props);
		this.ds= new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state={
            lines:[],
        }
		this.file=null
		this.default_func1 = 'SELECT * into {DST} from {SRC} '
    }
	componentWillMount(){
		let file=this.getFileInfo(this.props.file)
		this.execFunc1(file)
    }
	execFunc1(file){
		AsyncStorage.getItem("func1").then((func1)=>{
			let sql1 = func1
			if(!sql1) sql1 = this.default_func1
			let dst = 'csv("'+file.dir+'/func1.csv")'
			let sql = sql1.replace('{DST}',dst).replace('{SRC}',file.ext+'("'+file.full+'") ')
			var sql2 = 'SELECT * from csv("'+file.dir+'/func1.csv") '
			alert('sql='+sql)
			alasql(sql,[],(result1)=>{
				alasql(sql2,[],(result2)=>{
					this.setState({
						lines:result2,
					})
				})
			})
		});
		
	}
	getFileInfo(filePath){
		//filename.replace('%3A',':').replace('%2F','/')
		let lastIdx = filePath.lastIndexOf('/')
		let file = filePath.substr(lastIdx+1)
		let folder = filePath.substr(0,lastIdx)
		let dotIdx = file.lastIndexOf('.')
		let fileNoExt = file.substr(0,dotIdx)
		let ext = file.substr(dotIdx+1)
		return{
			dir:folder,
			name:file,
			ext:ext,
			noext:fileNoExt,
			full:filePath,
		}
	}
	_renderRowView(rowData) {
		if(rowData==null) return
		//onPress={()=>this._onPress(rowData)}
		return (
		<TouchableHighlight underlayColor='#c8c7cc'  >
			<View>
				<View style={{flexDirection:'row',justifyContent:'center',height:30,}}>
					{Object.keys(rowData).map((key,i)=>{
						return <Text key={i} style={{fontSize:12,margin:5}}>{rowData[key]}</Text>
					})}
				</View>
				<View style={styles.separator} />
			</View>
		 </TouchableHighlight>
		);
	}
    render(){
		//<Text>File:{this.props.file}</Text>
        return (
			<ListView style={styles.listContainer}
				dataSource={this.ds.cloneWithRows(this.state.lines)}
				renderRow={this._renderRowView.bind(this)}
				enableEmptySections={true}
			/>
        );
    }
}
