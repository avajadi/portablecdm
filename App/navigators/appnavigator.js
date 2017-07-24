import React, { Component } from 'react';
import {Text} from 'react-native';
import { StackNavigator, DrawerNavigator, TabNavigator, TabBarBottom } from 'react-navigation';


import ActorList    from '../components/actor-list-view';
import Home         from '../components/home-view';
import SendPortCall from '../components/send-portcall-view';
import StateList    from '../components/state-list-view';
import PortCallList from '../components/portcall-list-view';
import TimeLineView from '../components/timeline-view';
import FilterMenu   from '../components/portcall-list-view/sections/filterMenu';
import StateDetails from '../components/timeline-view/sections/statedetails';

import SideMenu     from '../components/side-menu-view';


// const PortCallListNavigator = StackNavigator({
//   PortCallList: { screen: PortCallList},
//   FilterMenu: {screen: FilterMenu},
//   TimeLineDetails: {screen: TimeLineView},
//   StateDetails: { screen: StateDetails}  
//   }, {
//   navigationOptions: {
//     gesturesEnabled: false
//   },
//   headerMode: 'none'
// });

const TimeLineNavigator = StackNavigator({
  TimeLineDetails: {screen: TimeLineView},
  StateDetails: { screen: StateDetails},
  SendPortCall: { screen: SendPortCall },    
}, {
  headerMode: 'none',
});

const PortCallListNavigator = StackNavigator({
  PortCallList: { screen: PortCallList},
  FilterMenu: {screen: FilterMenu},
}, {
  headerMode: 'none',
});

export const AppNavigator = DrawerNavigator({
  PortCalls: { screen: PortCallListNavigator },
  TimeLine: {screen: TimeLineNavigator},
  StateList: { screen: StateList },
  Home: { screen: Home },  
}, {
  headerMode: 'none',
  drawerWidth: 250,
  contentComponent: SideMenu,
  // contentOptions: {
  //   items: ['PortCalls', 'TimeLine', 'Home', 'SendPortCall'],
  // }
});

// export const TabBarNavigator = TabNavigator({
//   TimeLineDetails: {screen: TimeLineView},
//   Home: { screen: Home },  
//   ActorSelection: { screen: ActorList },  
  
// }, {   
//   tabBarOptions: {
//     activeTintColor: '#e91e63',
//   }, 
//   tabBarComponent: TabBarBottom,
//   tabBarPosition: 'bottom',
// },
// );

// }, 
// // {
// // navigationOptions: {
// //   gesturesEnabled: true
// // },
// // }
// );


