
'use strict';

import React, { Component } from 'react';
import { 
  WebView 
} from 'react-native';

class SearchMedicalWebView extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      props: props
    };
  }
  
  render() {
    var url = 'http://observatorio.digemid.minsa.gob.pe/Precios/ProcesoL/Consulta/FichaProducto.aspx?idp=' + this.props[0] + '&ide=' + this.props[5];
    console.log(url);
    return (
      <WebView
        source={{uri: url}}
      />
      
    );
  }
}

module.exports = SearchMedicalWebView;