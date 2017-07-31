import React, { Component } from 'react';
import {
  View,
  Platform,
  StyleSheet,
} from 'react-native';

import { 
  Text,
  Icon,
} from 'react-native-elements';

import colorScheme from '../../config/colors';

export default class MiniHeader extends Component {
  render() {
    const {navigation, title, rightIconFunction, leftIconFunction} = this.props;

    return(
      <View style={styles.container}>
        <Icon
          name= 'close'
          color= {colorScheme.primaryContainerColor}
          size= {30}
          onPress={leftIconFunction}
          size= {40}
          onPress={() => navigation.goBack()}
        />
        <Text h4 style={styles.headerText}>{title}</Text>
        <Icon
          name="check-circle"
          color='white'
          size={40}
          onPress={rightIconFunction}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    backgroundColor: colorScheme.primaryColor,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  headerText: {
      color: colorScheme.primaryTextColor,
  },
  signText: {
    color: colorScheme.primaryTextColor,
  },
});