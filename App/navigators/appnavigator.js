import React, { Component } from 'react';
import {Text, Dimensions} from 'react-native';
import { StackNavigator, DrawerNavigator, TabNavigator, TabBarBottom } from 'react-navigation';


import ActorList    from '../components/actor-list-view';
import Home         from '../components/home-view';
import SendPortCall from '../components/send-portcall-view';
import StateList    from '../components/state-list-view';
import PortCallList from '../components/portcall-list-view';
import TimeLineView from '../components/timeline-view';
import FilterMenu   from '../components/portcall-list-view/sections/filterMenu';
import StateDetails from '../components/timeline-view/sections/statedetails';
import OverView     from '../components/overview-view';
import VesselInfo   from '../components/vessel-info-view';
import PortInfo     from '../components/port-info-view';
import Settings     from '../components/settings-view';
import LoginView    from '../components/login-view';
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
  // Login : { screen: LoginView },
  PortCalls: { screen: PortCallListNavigator },
  TimeLine: {screen: TimeLineNavigator},
  StateList: { screen: StateList },
  Home: { screen: Home },  
  OverView: { screen: OverView },
  VesselInfo: { screen: VesselInfo },
  PortInfo: { screen: PortInfo },
  Settings: { screen: Settings },
}, {
  headerMode: 'none',
  drawerWidth: 3*Dimensions.get('window').width/4, 
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


