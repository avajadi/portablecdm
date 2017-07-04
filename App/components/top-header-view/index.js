import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import { 
  Text,
  Header,
  Icon,
  Button
} from 'react-native-elements';

import colorScheme from '../../config/colors';

export default class TopHeader extends Component {
  render() {
    const {title} = this.props;
//  const {navigation} = this.props; // Testade om det gick att navigera med knapparna...
//  const {navigate} = navigation;

    return(
      <View style={styles.container}>
        <Icon
          name='menu'
          color= {colorScheme.primaryContainerColor}
          size = {32}
          onPress={() => console.log('Menu button was pressed')}
         // onPress={() => navigate('SideBarMenu')}
        />
        <Text 
          style= {styles.headerText} 
          h4 
        >
          {title}
        </Text>
        <Icon
          name='add-circle'
          color = {'white'}
          size = {32}
          color= {colorScheme.primaryContainerColor}
          onPress={() => console.log('Adding button was pressed')}
        />
      </View>
    );
  }
}
// 
const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    backgroundColor: colorScheme.primaryColor,
    justifyContent: 'space-between'
  
  },
  headerText: {
      color: colorScheme.primaryTextColor,
  },
  signText: {
    color: colorScheme.primaryTextColor,
  }


});


