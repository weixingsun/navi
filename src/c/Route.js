/**
 * Route: Includes all route actions here
 * Project: navi
 * Package: com.navi
 * Author: Weixing Sun on 2016-12-19 10:20
 * Email:  Weixing.Sun@Gmail.Com
 */
import {Actions} from "react-native-router-flux";
import Google from '../c/api/Google'

module.exports = {
    /**
     * Action: for navigation mode, fake it for now
     * @param {null}
     */
    startRouteMode(){
        alert('start routing')
    },
    /**
     * Action switch: for driving route, will merge three route functions into 1
     * @param {null} but using internal state
     */
    route(start,dest,mode){
		Google.route(start,dest,mode,(result)=>{
			Actions.refresh({
				route_result: { mode, result }
			})
        })
    },
    /**
     * Action switch: for transit route, will merge three route functions into 1
     * @param {null} but using internal state
     */
    routeBus(){
        Actions.refresh({
            route: {
                start:this.state.start,
                dest: this.state.dest,
                mode: 'transit',
            }
        })
    },
    /**
     * Action switch: for walking route, will merge three route functions into 1
     * @param {null} but using internal state
     */
    routeWalk(){
        Actions.refresh({
            route: {
                start:this.state.start,
                dest: this.state.dest,
                mode: 'walking',
            }
        })
    },
}