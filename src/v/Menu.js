import React from 'react';
import {Alert, Platform, View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import FIcon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import I18n from 'react-native-i18n';
import styles from './Styles'
var Mailer = require('NativeModules').RNMail;
//import Button from "react-native-button";
/**
 * Side menu in drawer
 * Project: navi
 * Package: com.navi
 * Author: Weixing Sun on 2016-12-19 10:18
 * Email:  Weixing.Sun@Gmail.Com
 */
const contextTypes = {
    drawer: React.PropTypes.object,
};

const MailSender = ()=>{
    Mailer.mail({
        subject: 'Query about this Navi app',
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
const renderOneMenu = (drawer,Icon,icon,name,func)=>{
    return(
        <TouchableOpacity
            style={styles.menu0}
            onPress={() => { drawer.close(); if(typeof func==='function'){ func() }} }>
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
    return (
        <View style={styles.menu_container}>
            <View style={styles.menu_title}>
                <View style={{width:44,justifyContent:"center",marginLeft:20}}>
                    <FIcon name={'cog'} size={30} color={'white'} />
                </View>
                <View style={{justifyContent:"center",}}>
                    <Text style={styles.menu_name}>Settings</Text>
                </View>
                <View style={{flex:1}}/>
            </View>
            {renderOneMenu(drawer,FIcon,'star','My Places',()=>{})}
            {renderOneMenu(drawer,MIcon,'traffic','Traffic',()=>{})}
            {renderOneMenu(drawer,FIcon,'globe','Satellite',()=>{})}
            {renderOneMenu(drawer,FIcon,'balance-scale','Units',()=>{})}
            {renderOneMenu(drawer,FIcon,'language','Language',()=>{})}
            {renderOneMenu(drawer,FIcon,'info-circle','About',()=>{})}
            {renderOneMenu(drawer,FIcon,'envelope','Contact Me',()=>DoubleConfirmDialog(I18n.t("feedback"),I18n.t("confirm_feedback"),MailSender))}
        </View>
    )
}
Menu.contextTypes = contextTypes;
export default Menu;
