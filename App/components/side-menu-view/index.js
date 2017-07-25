import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions, 
} from 'react-native';

import {
    Text,
    Button,
    List,
    ListItem,
    Divider,
    Icon,
    Avatar,
} from 'react-native-elements';

import colorScheme from '../../config/colors';

class SideMenu extends Component {
  render() {

    const { navigate, state } = this.props.navigation;
    const { selectedPortCall, vessel, activeItemKey } = this.props;

    const haveSelectedPortCall = !!selectedPortCall;
    const containerStyle = haveSelectedPortCall ? styles.menuContainer : [styles.menuContainer, styles.unavailableContainer];
    
    return(
      <ScrollView style={styles.container}>

        <Text style={styles.menuText}>Det här är en sidomeny!</Text>

                <List>
                    {/* Menu */}
                    <ListItem
                        containerStyle={activeItemKey === 'PortCalls' ? [styles.menuContainer, styles.selectedContainer] : styles.menuContainer}
                        leftIcon={{
                          name:'home',
                          color: 'white'
                          }}
                        hideChevron
                      //  hideChevron
                        title={
                            <View style={styles.textContainer}>
                                <Text style={styles.menuText} > Select PortCall 
                                </Text>     
                            </View>
                        }
                        onPress={() => navigate('PortCalls')}
                    />
     
                    <ListItem
                        containerStyle={activeItemKey === 'StateList' ? [containerStyle, styles.selectedContainer] : containerStyle}
                          leftIcon={{
                          name: 'access-time',
                          color: 'white'
                        
                        }}
                        hideChevron
                        title={
                            <View style={styles.textContainer}>
                                <Text style={styles.menuText} > Report Portcall
                                </Text>     
                            </View>
                        }
                        onPress={() => {
                            if (haveSelectedPortCall && activeItemKey !== 'StateList')
                                navigate('StateList');
                        }}
                        
                    />
    
                    <ListItem
                        containerStyle={activeItemKey === 'OverView' ? [containerStyle, styles.selectedContainer] : containerStyle}
                        leftIcon={{name:'remove-red-eye',
                        color: 'white'
                        }}
                        hideChevron
                      //  hideChevron
                        title={
                            <View style={styles.textContainer}>
                                <Text style={styles.menuText} > PortCall Overview
                                </Text>     
                            </View>
                        }
                        onPress={() => {
                            if (haveSelectedPortCall && activeItemKey !== 'OverView')
                                navigate('OverView');
                        }}
                    />

                    <ListItem
                        containerStyle={activeItemKey === 'TimeLine' ? [containerStyle, styles.selectedContainer] : containerStyle}
                        leftIcon={{
                          name:'timeline',
                          color: 'white'}}
                        hideChevron
                      //  hideChevron
                        title={
                            <View style={styles.textContainer}>
                                <Text style={styles.menuText} > PortCall Timeline
                                </Text>     
                            </View>
                        }
                        onPress={() => {
                            if (haveSelectedPortCall && activeItemKey !== 'TimeLine')
                                navigate('TimeLine');
                        }}
                    />
                    <ListItem
                        containerStyle={activeItemKey === 'VesselInfo' ? [containerStyle, styles.selectedContainer] : containerStyle}
                        leftIcon={{
                          name:'directions-boat',
                          color: 'white'}}
                        hideChevron
                      //  hideChevron
                        title={
                            <View style={styles.textContainer}>
                                <Text style={styles.menuText} > Vessel Info
                                </Text>     
                            </View>
                        }
                        onPress={() => {
                            if (haveSelectedPortCall && activeItemKey !== 'VesselInfo')
                                navigate('VesselInfo');
                        }}
                    />

                    <ListItem
                        containerStyle={activeItemKey === 'PortInfo' ? [styles.menuContainer, styles.selectedContainer] : styles.menuContainer}
                        leftIcon={{
                          name:'business',
                          color: 'white'}}
                        hideChevron
                      //  hideChevron
                        title={
                            <View style={styles.textContainer}>
                                <Text style={styles.menuText} > Port Info
                                </Text>     
                            </View>
                        }
                        onPress={() => {
                            if (activeItemKey !== 'PortInfo')
                                navigate('PortInfo');
                        }}
                    />

                    <ListItem
                        containerStyle={activeItemKey === 'MultiView' ? [containerStyle, styles.selectedContainer] : containerStyle}
                        leftIcon={{
                          name:'dashboard', 
                          color: 'white'
                          }}
                        hideChevron
                      //  hideChevron
                        title={
                            <View style={styles.textContainer}>
                                <Text style={styles.menuText} > PortCall Multiple View
                                </Text>     
                            </View>
                        }
                    />
                    <ListItem
                        containerStyle={activeItemKey === 'Settings' ? [styles.menuContainer, styles.selectedContainer] : styles.menuContainer}
                        leftIcon={{
                          name:'settings',
                          color: 'white'
                        }}
                        hideChevron
                      //  hideChevron
                        title={
                            <View style={styles.textContainer}>
                                <Text style={styles.menuText} > Settings
                                </Text>     
                            </View>
                        }
                        onPress={() => {
                            if(activeItemKey !== 'Settings')
                                navigate('Settings');
                        }}
                    />

                    <ListItem
                        containerStyle={styles.menuContainer}
                        leftIcon={{
                          name:'exit-to-app',
                          color: 'white'
                          }}
                        hideChevron
                      //  hideChevron
                        title={
                            <View style={styles.textContainer}>
                                <Text style={styles.menuText} > Logout
                                </Text>     
                            </View>
                        }
                    />

                </List>
          

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme.sidebarColor,
  },
  menuText: {
    color: colorScheme.primaryTextColor,
    //fontWeight: 'bold',
  },
  menuContainer: {
    backgroundColor: colorScheme.sidebarColor,
    paddingLeft: 10,
    
  },
  textContainer: {
    //backgroundColor: 'pink',
    paddingLeft: 10,

  },
  selectedContainer: {
    backgroundColor: 'black',
  },
  unavailableContainer: {
    backgroundColor: 'grey',
  }

})


function mapStateToProps(state) {
    return {
        selectedPortCall: state.portCalls.selectedPortCall,
        vessel: state.portCalls.vessel,
    }
}

export default connect(mapStateToProps)(SideMenu);
