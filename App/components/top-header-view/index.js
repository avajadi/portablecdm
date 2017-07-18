import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import { 
  Text,
  Icon,
  Button,
  SideMenu
} from 'react-native-elements';

import colorScheme from '../../config/colors';
import SideMenuView from '../side-menu-view';

// Class showing the first header. The header should later adjust to other pages. 
export default class TopHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sideMenuOpen: false,
    };
  }

  render() {
    const {title} = this.props;
    
    return(
      <View >
          <View style={styles.container}>
          <Icon
            name= 'menu'
            color= {colorScheme.primaryContainerColor}
            size= {50}
            onPress={() => this.props.navigation.navigate('DrawerOpen', {test: 'TEST'})}
          /> 
          <Text 
            style= {styles.headerText} 
            h4 
          >
            {title}
          </Text>
          <Icon
            name='add-circle'
            size = {50}
            color= {colorScheme.primaryContainerColor}
            onPress={() => console.log('Adding button was pressed')}
          />
        </View>
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
    paddingBottom: 15,
    flexDirection: 'row',
    backgroundColor: colorScheme.primaryColor,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
      color: colorScheme.primaryTextColor,
  },
  signText: {
    color: colorScheme.primaryTextColor,
  },
});