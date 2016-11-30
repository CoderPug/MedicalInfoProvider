
'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Image
} from 'react-native';

var styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  }
});

class SearchMedicalInfo extends Component {
  render() {
    return (
      
      <View style={styles.container}>
        <Text style={styles.description}>
          Search for medical information!
        </Text>
        <Text style={styles.description}>
          Search by name near your location!
        </Text>
      </View>
      
    );
  }
}

module.exports = SearchMedicalInfo;
