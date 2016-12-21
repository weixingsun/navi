/**
 * Define all styles here
 * Project: navi
 * Package: com.navi
 * Author: Weixing Sun on 2016-12-19 10:18
 * Email:  Weixing.Sun@Gmail.Com
 */

import {
    Dimensions,
    ListView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,
} from "react-native";
module.exports = {

    menu_container: {
        flex: 1,
        //justifyContent: "center",
        //alignItems: "flex-start",
        backgroundColor: "#2a2929",
        //padding:20,
        //borderWidth: 2,
        //borderColor: 'gray',
    },
    menu_title: {
        flexDirection: 'row',
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
        height: 48,
        paddingLeft: 6,
        marginTop: 1,
    },
    menu_name: {
        marginLeft: 10,
        fontSize: 14,
        color: 'white',
    },
    menu_link: {
        marginLeft: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    ///////////////////////////////////////////////////////
    walking: {
        width: 5,
        color: 'red',
    },
    transit: {
        width: 5,
        color: 'green',
    },
    driving: {
        width: 5,
        color: 'blue',
    },
    section: {
        //flex: 1,
        justifyContent: 'center',
        //alignItems: 'center',
        flexDirection: 'row',
    },
    title: {
        //backgroundColor:'#eeeeee',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 6,
    },
    title_name: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    small_title_name: {
        fontSize: 12,
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
        marginTop: Platform.OS === 'android' ? 54 : 64,
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
    inner_place: {
        //flex:1,
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 100,
        position: 'absolute',
        //top: 550,
        left: 0,
        right: 0,
        bottom: 0,
        //width:Dimensions.get('window').width,
    },
    inner_search: {
        backgroundColor: 'white',
        height: 90,
        //width:Dimensions.get('window').width-60,
        //marginLeft:2,
        //marginRight:60,
        position: 'absolute',
        ...Platform.select({
            ios: {
                top: 64,
            },
            android: {
                top: 54,
            },
        }),
        left: 2,
        right: 60,
    },
    home_place_address: {
        //fontWeight:'bold',
        fontSize: 12,
        marginTop: 3,
        marginLeft: 5,
    },
    search_icon: {
        marginLeft: 10,
        marginTop: 10,
        marginRight: 5,
    },
    search_input: {
        flex: 1,
        height: 45,
        fontSize: 12,
        padding: 4,
    },
    home_right_icon: {
        //position: 'relative',
        ...Platform.select({
            ios: {
                marginTop: -5,
            },
            android: {
                marginTop: 0,
            },
        }),
        marginRight: 10,
    },
};