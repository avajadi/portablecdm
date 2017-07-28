import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions, 
  Image
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
    const textStyle = haveSelectedPortCall ? styles.menuText : [styles.menuText, styles.unavailableMenuText];
    
    return(
        <ScrollView style={styles.container}>    
            <View style={styles.headerContainer}>
                {!! vessel &&
                <Image
                    style={{ 
                        width: 3*Dimensions.get('window').width/4-20,
                        height: Dimensions.get('window').height/4,
                        borderRadius: 5,
                        }}
          
                source={{uri:vessel.photoURL }} 
                />}
                {!!vessel && 
                    <Text style={styles.headerText}>{vessel.name}</Text>}
                {!vessel && 
                <Text style={styles.headerText}>Select a Portcall</Text>}
            </View>    


<Divider style={{backgroundColor: colorScheme.secondaryContainerColor, height: 0.7,}}/>

            <View style={styles.listContainer}>
                <List style={{paddingTop: 0}}>
                    {/* Menu */}
                    <ListItem
                        containerStyle={activeItemKey === 'PortCalls' ? [styles.menuContainer, styles.selectedContainer] : styles.menuContainer}
                        leftIcon={{
                          name:'home',
                          color: 'white',
                          }}
                        hideChevron
                        underlayColor={colorScheme.secondaryColor}
                        title={
                            <View style={styles.textContainer}>
                                <Text style={styles.menuText}>Select PortCall</Text>     
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
                        underlayColor={colorScheme.secondaryColor}
                        title={
                            <View style={styles.textContainer}>
                                <Text style={textStyle}>Report Portcall</Text>     
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
                        underlayColor={colorScheme.secondaryColor}
                        title={
                            <View style={styles.textContainer}>
                                <Text style={textStyle}>PortCall Overview</Text>     
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
                        underlayColor={colorScheme.secondaryColor}
                        title={
                            <View style={styles.textContainer}>
                                <Text style={textStyle}>PortCall Timeline</Text>     
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
                        underlayColor={colorScheme.secondaryColor}
                        title={
                            <View style={styles.textContainer}>
                                <Text style={textStyle}>Vessel Info</Text>     
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
                        underlayColor={colorScheme.secondaryColor}
                        title={
                            <View style={styles.textContainer}>
                                <Text style={styles.menuText} >Port Info</Text>     
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
                        underlayColor={colorScheme.secondaryColor}
                        title={
                            <View style={styles.textContainer}>
                                <Text style={textStyle}>PortCall Multiple View</Text>     
                            </View>
                        }
                    />
                    <ListItem
                        containerStyle={activeItemKey === 'Settings' ? [styles.menuContainer, styles.selectedContainer] : styles.menuContainer}
                        leftIcon={{
                          name:'settings',
                          color: 'white',
                        }}
                        hideChevron
                        underlayColor={colorScheme.secondaryColor}
                        title={
                            <View style={styles.textContainer}>
                                <Text style={styles.menuText} >Settings</Text>     
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
                        underlayColor={colorScheme.secondaryColor}
                        title={
                            <View style={styles.textContainer}>
                                <Text style={styles.menuText} >Logout</Text>     
                            </View>
                        }
                    />
                </List>
            </View>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  //  flex: 1,
    backgroundColor: colorScheme.sidebarColor,
    paddingTop: 25,
  },
  headerContainer: {
    backgroundColor: colorScheme.sidebarColor,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
  },
  headerText: {
    textAlign: 'center',
    color: colorScheme.primaryTextColor,
    paddingTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    backgroundColor: colorScheme.sidebarColor,
 //   paddingTop: 10,
    marginTop: 0,
  },
  menuContainer: {
    backgroundColor: colorScheme.sidebarColor,
    paddingLeft: 10,
  },  
  menuText: {
    color: colorScheme.primaryTextColor,
  },
  unavailableMenuText: {
      color: colorScheme.tertiaryTextColor,
  },
  textContainer: {
    marginLeft: 10,
  },
  selectedContainer: {
    backgroundColor: colorScheme.primaryColor,
  },
  unavailableContainer: {
    backgroundColor: colorScheme.sidebarColor,
  },
  // Not being used at the moment...It is now hard coded.
  underlayColorStyle: {
      color: colorScheme.tertiaryTextColor
  },

})



function mapStateToProps(state) {
    return {
        selectedPortCall: state.portCalls.selectedPortCall,
        vessel: state.portCalls.vessel,
    }
}

export default connect(mapStateToProps)(SideMenu);
