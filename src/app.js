import React, { Component } from 'react'
import {Actions, Scene, Router, ActionConst,} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import Drawer from './v/Drawer'
import Menu from './v/Menu'
import Home from './v/Home'
import About  from './v/About'
import Search from './v/Search'
import MultiLang from './lang/all'
import {Provider} from 'react-redux'

import configureStore from './lib/configureStore'
import {setStore} from './reducers/global/globalActions'
import GlobalInitialState from './reducers/global/globalInitialState'
import pack from '../package'
var VERSION = pack.version
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state={
			global: (new GlobalInitialState())
        }
    }
    componentWillMount() {}
	renderQueryIcon(){
		return <Icon style={{marginRight:15,marginBottom:5}} name={'search'} size={30} color={'#333'} onPress={()=> Actions.search() } />
	}
    render() {
        let drIcon=<Icon style={{marginLeft:6}} name={"bars"} color={"#2a2929"} size={30}/>
		const store = configureStore(this.state)
		store.dispatch(setStore(store))
        return (
            <Router>
                <Scene key="drawer" component={Drawer} open={false} type={"reset"} >
                <Scene key="content">
                    <Scene key="home" component={Home} initial={true} type={ActionConst.RESET} drawerIcon={drIcon} renderRightButton={this.renderQueryIcon}/>
                    <Scene key="about" component={About} title="About Navi" />
					<Scene key="search" component={Search} title="" />
                </Scene>
                </Scene>
            </Router>
        )
    }
}
