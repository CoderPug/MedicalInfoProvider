
'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  ListView,
  Image,
  Dimensions
} from 'react-native';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    paddingBottom: 0,
    marginTop: 65,
    alignItems: 'center'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  listContainer: {
    width: width
  },
  rowContainer: {
    padding: 10,
    height: 70,
    justifyContent: 'space-around'
  },
  rowText: {
    fontSize: 16,
    textAlign: 'left',
    color: '#656565'
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  }
});

class SearchMedicalInfo extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      isLoading: false,
      message: '',
      dataSource: new ListView.DataSource(
        { rowHasChanged: (r1, r2) => r1.id !== r2.id}
      )
    };
  }
  
  onSearchTextChanged(event) {
    this.setState({ searchString: event.nativeEvent.text });
  }
  
  _executeQuery(query) {
  
    if (this.state.searchString.length < 3) {
      this.setState({
        isLoading: false,
        message: 'Por favor ingrese al menos 3 caracteres'
      });
      return;
    }
    
    this.setState({ isLoading: true });
    console.log('{"term":' + this.state.searchString + ',"avanzado":"0"}');
    
    var request = new Request(query, {
      method: 'POST',
      body: '{"term":"' + this.state.searchString + '","avanzado":"0"}',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
    
    fetch(request)
      .then(response => response.json())
      .then(json => this._handleResponse(json))
      .catch(error =>
        this.setState({
          isLoading: false,
          message: 'Error ' + error
        }));
  }
  
  onSearchPressed() {
    var baseURL = 'http://observatorio.digemid.minsa.gob.pe/';
    var getMedicineListURI = 'Precios/ProcesoL/Consulta/BusquedaGral.aspx/GetListaMedicamentos';
    var query = baseURL + getMedicineListURI;
    this._executeQuery(query);
  }
  
  _handleResponse(response) {
    
    var count = response.d.length;
    console.log(count);
    
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.id !== r2.id
    });
    
    this.setState({ 
      isLoading: false,
      message: count + ' resultados',
      dataSource: dataSource.cloneWithRows(response.d)
    });

    console.log(response.d);
  }
  
  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight underlayColor='#dddddd'>
          <View style={styles.rowContainer}>
            <View>
              <Text style={styles.rowText}>
              {rowData.value}
              </Text>
            </View>
            <View style={styles.separator}/>
          </View>
      </TouchableHighlight>
    );
  }
  
  render() {
    
    var spinner = this.state.isLoading ? ( <ActivityIndicator size='large' /> ) : ( <View/> );
    
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Busca el precio de productos farmacéuticos
        </Text>
        <View style={styles.flowRight}>
          <TextInput 
            style={styles.searchInput}
            value={this.state.searchString}
            onChange={this.onSearchTextChanged.bind(this)}
            placeholder='Ingresa el nombre'
          />
          <TouchableHighlight 
            style={styles.button}
            onPress={this.onSearchPressed.bind(this)}
            >
            <Text style={styles.buttonText}>Buscar</Text>
          </TouchableHighlight>
        </View>
        {spinner}
        <Text style={styles.description}>{this.state.message}</Text>
        <ListView 
          style={styles.listContainer}
          dataSource={this.state.dataSource}
          automaticallyAdjustContentInsets={false}
          renderRow={this.renderRow.bind(this)}
        />
      </View>
    );
    
  }
}

module.exports = SearchMedicalInfo;
