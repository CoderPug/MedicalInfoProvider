
'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableHighlight,
  ListView,
  Dimensions
} from 'react-native';

var searchMedicalWebView = require('./SearchMedicalWebView');
var width = Dimensions.get('window').width;

var styles = StyleSheet.create({
  
  container: {
    marginTop: 65
  },
  heading: {
    backgroundColor: '#F8F8F8',
  },
  separator: {
    height: 1,
    backgroundColor: '#DDDDDD'
  },
  title: {
    fontSize: 20,
    margin: 5,
    color: '#656565'
  },
  listContainer: {
    width: width
  },
  rowContainer: {
    padding: 20,
    height: 80,
    justifyContent: 'space-around'
  },
  rowText: {
    fontSize: 16,
    textAlign: 'left',
    color: '#656565'
  }
});

class SearchMedicalResult extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      props: props,
      isLoading: false,
      message: '',
      dataSource: new ListView.DataSource(
        { rowHasChanged: (r1, r2) => r1 !== r2 }
      )
    };
  }
  
  _executeQuery(data) {
    
    console.log('ENTER EXECUTE');
    
    var baseURL = 'http://observatorio.digemid.minsa.gob.pe/';
    var getPriceListURI = 'Precios/ProcesoL/Consulta/data.aspx?';
    
    var productIdValues = data.id.split('@');
    console.log(productIdValues);
    var productName = data.value.replace(/ /g , "*");
    console.log(productName);
    if (productIdValues.length != 4) {
      //  Error 
      return;
    }
    var productGroup = productIdValues[0];
    var productRelated = productIdValues[1];
    var productCon = productIdValues[2];
    var productFFS = productIdValues[3];
    
    var query = baseURL + getPriceListURI + "grupo=" + productGroup + "&tipo_busqueda=3&totalPA=1&relacionado=" + 
    productRelated + "&con=" + productCon + "&ffs=" + productFFS + "&ubigeo=15&cad=" + productName + 
    "&_=1480520923076&sEcho=1&iColumns=9&sColumns=&iDisplayStart=0&iDisplayLength=150&sSearch=&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=true&sSearch_1=TODOS&bRegex_1=false&bSearchable_1=true&sSearch_2=&bRegex_2=false&bSearchable_2=true&sSearch_3=&bRegex_3=false&bSearchable_3=true&sSearch_4=&bRegex_4=false&bSearchable_4=true&sSearch_5=&bRegex_5=false&bSearchable_5=true&sSearch_6=&bRegex_6=false&bSearchable_6=true&sSearch_7=&bRegex_7=false&bSearchable_7=true&sSearch_8=&bRegex_8=false&bSearchable_8=true&iSortingCols=0&bSortable_0=false&bSortable_1=false&bSortable_2=false&bSortable_3=false&bSortable_4=false&bSortable_5=false&bSortable_6=false&bSortable_7=false&bSortable_8="
    
    console.log(query);
    
    this.setState({ isLoading: true });
    
    var request = new Request(query, {
      method: 'GET',
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
  
  _handleResponse(response) {
    
    var count = response.aaData.length;
    if (count == 0) {
      this.setState({ 
        isLoading: false,
        message: count + ' resultados'
      });
      return;
    }
    
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    
    this.setState({ 
      isLoading: false,
      message: count + ' resultados',
      dataSource: dataSource.cloneWithRows(response.aaData)
    });

    console.log(response.aaData);
  }
  
  onSearchPressed() {
    
    this._executeQuery(this.props);
  }
  
  rowPressed(data) {
  
    this.props.navigator.push({
      title: 'WEB',
      component: searchMedicalWebView,
      passProps: data
    });
  }
  
  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight
        onPress={() => this.rowPressed(rowData)}
        underlayColor='#dddddd'>
          <View style={styles.rowContainer}>
            <View>
              <Text style={styles.rowText}>
                {rowData[1] + " - " + rowData[4] + " - " + rowData[6]}
              </Text>
              <Text style={styles.rowText}> 
                { "Precio = S/." + rowData[7] }
              </Text>
            </View>
          </View>
      </TouchableHighlight>
    );
  }
  
  render() {
    var data = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Producto:
        </Text>
        <Text style={styles.title}>
          {data.value}
        </Text>
        <Text style={styles.title}>
          Precios:
        </Text>
        <TouchableHighlight 
          onPress={this.onSearchPressed.bind(this)}
          >
          <Text>Buscar</Text>
        </TouchableHighlight>
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

module.exports = SearchMedicalResult;