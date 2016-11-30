
'use strict';

var SearchVC = require('./SearchMedicalInfo')

var React = require('react');
var ReactNative = require('react-native');

var styles = ReactNative.StyleSheet.create({
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 20,
    margin: 80
  },
  container: {
    flex: 1
  }
});

class MedicalInfo extends React.Component {
  render() {
    return ( 
      
      <ReactNative.NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Bienvenido',
          component: SearchVC
        }}/>
        
    );
  }
}

ReactNative.AppRegistry.registerComponent('MedicalInfo', function() { return MedicalInfo });

