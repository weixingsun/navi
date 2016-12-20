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
