import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  View,
  StyleSheet,
  WebView,
} from 'react-native';

import {
  Text
} from 'react-native-elements';

import colorScheme from '../../config/colors';

class LoginView extends Component {
  render() {

    const keycloakConfig = {
      url: "https://staging-maritimeid.maritimecloud.net/auth",
      realm: "MaritimeCloud",
      client_id: "0.1-urn:mrn:stm:service:instance:viktoria:summer-app",
      redirect_uri: "http://localhost/success.html",
      appsite_uri: "http://localhost/app.html"
    }

    return(
      <View style={styles.container}>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme.backgroundColor
  },
});

export default connect(null)(LoginView);