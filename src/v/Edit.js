import React from 'react';
import {AsyncStorage, Platform, View, Text, TextInput, StyleSheet} from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/FontAwesome';
//import SQLite from 'react-native-sqlite-storage'
//import alasql from 'alasql'
import alasql from '../sql/alasql.fs';
import AxInput from './AxInput';

var styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: "center",
        //alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
	content:{
        flex: 1,
		marginTop:Platform.select({
			ios: 64,
			android: 54,
		})
	},
	section:{
		flex: 1,
		justifyContent: 'center',
		//alignItems: 'center',
		//borderWidth: 1,
		//backgroundColor: '#fff',
		//borderColor: 'rgba(0,0,0,0.1)',
		//marginTop: 5,
		//shadowColor: '#ccc',
		//shadowOffset: { width: 2, height: 2, },
		//shadowOpacity: 0.5,
		//shadowRadius: 3,
		//flexDirection:'row',
		//padding: 15,
		//paddingTop:5,
		//paddingBottom:5,
	},
	title:{
		fontWeight:'bold',
		fontSize:20,
		backgroundColor:'#eeeeee',
	},
});

export default class FunctionEdit extends React.Component {
	constructor(props) {
        super(props);
        this.state={
			functions:{
				func1:'',
				func2:'',
				func3:'',
			},
        }
		this.default_func = 'SELECT * into {DST} from {SRC} '
    }
	componentWillMount(){
		this.getFormula()
    }
	getFormula(){
		this.getFunctionDB("func1")
		this.getFunctionDB("func2")
		this.getFunctionDB("func3")
	}
	getDefaultFunction(name){
		return this.default_func //.replace('{function}',name)
	}
	getFunctionDB(name){
		AsyncStorage.getItem(name).then((value)=>{
			if(value){
				this.state.functions[name]=value
				this.setState({
					functions:this.state.functions
				});
			}else{
				this.state.functions[name]=this.default_func
				this.setState({
					functions:this.state.functions
				});
			}
		});
	}
	setFunctionDB(name,value){
		AsyncStorage.setItem(name,value)
	}
	renderFunction(name){
		return(
		<View style={styles.section}>
			<Text style={styles.title}>{name}</Text>
			<AxInput
				//ref={textInput => (this.func1_input = textInput)}
				key={name}
				placeholder=""
				enablesReturnKeyAutomatically={true}
				returnKeyType="done"
				value={this.state.functions[name]}
				onChange={(event) => {
					let txt = event.nativeEvent.text
					this.state.functions[name]=txt
					this.setState({ functions: this.state.functions })
					this.setFunctionDB(name,txt)
				}}
			/>
		</View>
		)
	}
    render(){
        return (
            <View style={styles.container}>
				<View style={styles.content}>
					{this.renderFunction('func1')}
					{this.renderFunction('func2')}
					{this.renderFunction('func3')}
				</View>
            </View>
        );
    }
}
