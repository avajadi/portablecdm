import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  View,
  StyleSheet,

} from 'react-native';

import {
  Text,
  SearchBar,

} from 'react-native-elements';


class LocationSelection extends Component {

  render() {
    const { params } = this.props.navigation.state;

    return(
      <View style={styles.container}>
        <Text>{params.selectFor}</Text>
        <Text>{params.locationType}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default connect(null, {})(LocationSelection);