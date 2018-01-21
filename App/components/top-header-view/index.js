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
  Button,
  SideMenu
} from 'react-native-elements';

import colorScheme from '../../config/colors';

// Class showing the first header. The header should later adjust to other pages.
export default class TopHeader extends Component {

  render() {
    const {title, firstPage, rightIconFunction, backArrowFunction, leftIcons, selectorIcon, modal} = this.props;

    const topPadding = Platform.OS === 'android' && modal ? 30-StatusBar.currentHeight : 30;
    // const topPadding = 30;

    return(
      <View >
        <View style={[styles.container, {paddingTop: topPadding}]}>
          {/* On the landing page on IOS, and all pages on android we want to show a meny icon */}
          {(firstPage) &&
          <Icon
            name= 'menu'
            color= {colorScheme.primaryContainerColor}
            size= {50}
            underlayColor='transparent'
            onPress={() => this.props.navigation.navigate('DrawerOpen')}
          />
          }
          {/* But on all other pages on IOS, we want to show a back button  */}
          {(!firstPage) &&
          <Icon
            name= 'arrow-back'
            color= {colorScheme.primaryContainerColor}
            size= {50}
            underlayColor='transparent'
            onPress={() => { 
              if(!!backArrowFunction) {
                backArrowFunction();
              } else {
                this.props.navigation.goBack();
              }
            }}
          />
          }
          {(!!leftIcons && !!leftIcons.first) &&
            <Icon
                name={leftIcons.first.name}
                color={leftIcons.first.color}
                onPress={leftIcons.first.onPress}
                size={30}
            />}
          {(!!leftIcons && !!leftIcons.second) &&
            <Icon
                name={leftIcons.second.name}
                color={leftIcons.second.color}
                onPress={leftIcons.second.onPress}
                size={30}
            />}
          <Text
            style= {styles.headerText}
            h4
          >
          {title}
          </Text>
          {/* Compensate for the two icons to the left of the title */}
          {(!!leftIcons && !!leftIcons.first && !selectorIcon) &&
            <View style={{width: 30}}/>
          }
          {(!!leftIcons && !!leftIcons.second && !selectorIcon) &&
            <View style={{width: 30}}/>
          }
          {(!!leftIcons && !!leftIcons.first && !!leftIcons.second && !!selectorIcon) &&
            <View style={{width:15}}/>
          }
          {!!selectorIcon &&
            <Icon
            name={selectorIcon.name}
            color={selectorIcon.color}
            onPress={selectorIcon.onPress}
            size={30}
            />
          }
          {!!selectorIcon &&
           <View style={{width:15}}/>
          }
          {/* Only render the + icon if we have functionality for it on this view  */}
          {!!rightIconFunction &&
            <Icon
              name='add-circle'
              size = {50}
              underlayColor='transparent'
              color= {colorScheme.primaryContainerColor}
              onPress={() => rightIconFunction()}
            />
          }
          {/* If we dont have a function for the + button, we still want to render something of the same size
              otherwise, the title won't be in the right posisition  */}
          {!rightIconFunction &&
            <View style={{width: 50}}/>
          }
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
