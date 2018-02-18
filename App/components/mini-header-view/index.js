import React, { Component } from 'react';
import {
  View,
  Platform,
  StyleSheet,
  StatusBar,
} from 'react-native';

import {
  Text,
  Icon,
} from 'react-native-elements';

import colorScheme from '../../config/colors';

export default class MiniHeader extends Component {
  render() {
    const {navigation, title, rightIconFunction, leftIconFunction, hideRightIcon, modal} = this.props;
    const paddingTop = Platform.OS === 'android' && modal ? 30 - StatusBar.currentHeight : 30;

    return(
      <View style={[styles.container, {paddingTop}]}>
        <Icon
          name= 'close'
          color= {colorScheme.primaryContainerColor}
          size= {40}
          underlayColor='transparent'
          onPress={leftIconFunction}
        />
        <Text h4 style={styles.headerText}>{title}</Text>
        { !hideRightIcon &&
          <Icon
            name="check-circle"
            color='white'
            size={40}
            underlayColor='transparent'
            onPress={rightIconFunction}
          />
        }
        { hideRightIcon &&
          <View
            style={{height: 40, width: 40}}
          />
        }
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
