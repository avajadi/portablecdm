import React, { Component } from 'react';
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

export default class SideMenu extends Component {
  render() {
    //const {params} = this.props.navigation.state;
    //const {test} = params;
    return(
      <ScrollView style={styles.container}>

        <Text style={styles.menuText}>Det här är en sidomeny!</Text>

                <List>
                    {/* Menu */}
                    <ListItem
                        containerStyle={styles.menuContainer}
                        leftIcon={{
                          name:'home',
                          color: 'white'
                          }}
                        hideChevron
                      //  hideChevron
                        title={
                            <View style={styles.textContainer}>
                                <Text style={styles.menuText} > Home 
                                </Text>     
                            </View>
                        }
                    />
     
                    <ListItem
                        containerStyle={styles.menuContainer}
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
                    
                    />
    
                    <ListItem
                        containerStyle={styles.menuContainer}
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
                    />

                    <ListItem
                        containerStyle={styles.menuContainer}
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
                    />
                    <ListItem
                        containerStyle={styles.menuContainer}
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
                    />

                    <ListItem
                        containerStyle={styles.menuContainer}
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
                    />

                    <ListItem
                        containerStyle={styles.menuContainer}
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
                        containerStyle={styles.menuContainer}
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

})
