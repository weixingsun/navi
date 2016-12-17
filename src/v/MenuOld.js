import React from 'react';
import {Alert, Platform, View, Text, StyleSheet, TouchableOpacity} from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";
import {DocumentPickerUtil,DocumentPicker} from "react-native-document-picker";
//const DocumentPicker = require('react-native').NativeModules.RNDocumentPicker;
import Icon from 'react-native-vector-icons/FontAwesome';
var Mailer = require('NativeModules').RNMail;
import I18n from 'react-native-i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: "flex-start",
    backgroundColor: "#2a2929",
	//padding:20,
    //borderWidth: 2,
    //borderColor: 'gray',
  },
  menu_title: {
    justifyContent: "center",
    //alignItems: "flex-start",
    backgroundColor: "#2a2929",
	//padding:20,
	...Platform.select({
      ios: {
        height: 64,
      },
      android: {
        height: 54,
      },
    }),
  },
  menu0: {
    justifyContent: "center",
    //alignItems: "flex-start",
    backgroundColor: "#494949",
    height:48,
    paddingLeft:6,
    marginTop:1,
  },
  menu_name: {
    marginLeft:10,
    fontSize:14,
    color:'white',
  },
  menu_link:{
    marginLeft:10,
    flexDirection:'row',
    justifyContent:'center',
  },
});
const contextTypes = {
    drawer: React.PropTypes.object,
};
const showFilePicker = ()=>{
	DocumentPicker.show({
		//filetype: ['public.data'],
	},(result) => { 
		//{type:'text/comma-separated-values',fileName:'test.csv',fileSize:2499,uri:'content://...'}
		//console.log('Menu page get file:'+JSON.stringify(result))
		if(result.type==='text/comma-separated-values' //csv
		|| result.type==='application/vnd.ms-excel'    //xls
		|| result.type==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'  //xlsx
		){
			//alert('excel='+result.type)
			Actions.refresh({
				key:'home',
				file:result.path,
			});
		}else if(result.err){
			alert('err='+result.err)
		//}else if(result.type==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){  //xlsx
		//	alert('Excel 2010 not supported, Please use csv format')
		//}else if(result.type==='application/vnd.ms-excel'){  //xls
		//	alert('Excel 2007 not supported, Please use csv format')
		}else{
			alert('Not supported type: '+result.type)
		}
	});
}
const MailSender = ()=>{
    Mailer.mail({
        subject: 'Query about Xrows app',
        recipients: ['sun.app.service@gmail.com'],
        //ccRecipients: ['supportCC@example.com'],
        //bccRecipients: ['supportBCC@example.com'],
        body: '',
        //isHTML: true, // iOS only, exclude if false
        //attachment: {
        //  path: '',  // The absolute path of the file from which to read data.
        //  type: '',   // Mime Type: jpg, png, doc, ppt, html, pdf
        //  name: '',   // Optional: Custom filename for attachment
        //}
    }, (error, event) => {
        if(error) {
            alert('Could not open mailbox. Please send manually to sun.app.service@gmail.com ');
        }
    });
}
const DoubleConfirmDialog = (title,content,func)=>{
	Alert.alert(
		title,   //I18n.t("feedback"),
		content, //I18n.t("confirm_feedback"),
		[
			{text:I18n.t("no"), },
			{text:I18n.t('yes'), onPress:()=>{
				//Linking.openURL('mailto:sun.app.service@gmail.com')
				func()
			}},
		]
	);
}
const renderOneMenu = (drawer,icon,name,func)=>{
    return(
        <TouchableOpacity
            style={styles.menu0}
            onPress={() => { drawer.close(); if(typeof func==='function'){ func() }else{alert(JSON.stringify(Actions))} } }>
            <View style={styles.menu_link}>
                <View style={{width:24,justifyContent:"center",}}>
                    <Icon name={icon} size={20} color={'white'} />
                </View>
                <Text style={styles.menu_name}>{name}</Text>
                <View style={{flex:1}}/>
            </View>
        </TouchableOpacity>
        )
}
const Menu = (props, context) => {
    const drawer = context.drawer;
			//{renderOneMenu(drawer,'mouse-pointer','Graphic Editor',Actions.edit)}
    return (
        <View style={styles.container}>
            <View style={styles.menu_title}>
                <Text style={styles.menu_name}>Menu</Text>
            </View>
            {renderOneMenu(drawer,'folder','Open an Excel',showFilePicker)}
            {renderOneMenu(drawer,'cog','Function Editor',Actions.edit)}
            {renderOneMenu(drawer,'info-circle','About',Actions.about)}
            {renderOneMenu(drawer,'book','User Manual',Actions.book)}
            {renderOneMenu(drawer,'envelope','Contact Me',()=>DoubleConfirmDialog(I18n.t("feedback"),I18n.t("confirm_feedback"),MailSender))}
        </View>
    )
}
Menu.contextTypes = contextTypes;
export default Menu;
