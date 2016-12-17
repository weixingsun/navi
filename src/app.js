import React, { Component } from 'react'
import {Actions, Scene, Router, ActionConst,} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Drawer from './v/Drawer';
import Menu from './v/Menu'
import Home from './v/Home'
import About  from './v/About'
import Langs from './lang/all';
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state={
        }
    }
    componentWillMount() {}
    render() {
        let drIcon=<Icon name={"bars"} color={"#2a2929"} size={30}/>
        return (
            <Router>
                <Scene key="drawer" component={Drawer} open={false} type={"reset"} >
                <Scene key="root">
                    <Scene key="home" component={Home} title="Home" initial={true} hideNavBar={false} drawerIcon={drIcon}/>
                    <Scene key="about" component={About} title="About Navi" />
                </Scene>
                </Scene>
            </Router>
        )
    }
}
