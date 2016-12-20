/**
 * setup jest config here, mocking linking,permission,router,maps, etc.
 * Project: navi
 * Package: com.navi
 * Author: Weixing Sun on 2016-12-19 10:20
 * Email:  Weixing.Sun@Gmail.Com
 */

jest.mock('Linking', () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    openURL: jest.fn(),
    canOpenURL: jest.fn(),
    getInitialURL: jest.fn(),
  }
})
global.Permissions = {
  location: 'authorized',  //['authorized', 'denied', 'restricted', 'undetermined']
};
jest.mock('react-native-permissions',()=>{
  const permissions = require.requireActual('react-native-permissions')
  permissions.getPermissionStatus= function(type){
    return new Promise(resolve => global.Permissions[type])
  }
  return permissions
})
jest.mock('react-native-router-flux',()=>{
  //const rnrf = require.requireActual('react-native-router-flux')
  return { Actions:{
    push: function() {},
    reset: function() {},
    pop: function() {},
    refresh: function() {},
  }}
})
jest.mock('react-native-maps', () => {
  const React = require('React')
  return class MockMapView extends React.Component {
    static Marker = props => React.createElement('Marker', props, props.children);
    static propTypes = { children: React.PropTypes.any };
    render() {
      return React.createElement('MapView', this.props, this.props.children);
    }
  }
});
