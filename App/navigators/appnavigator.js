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
import Settings     from '../components/settings-view';
import LoginView    from '../components/login-view';
import SelectFavoriteState from '../components/select-favorite-state-view';
import VesselLists from '../components/vessel-lists-view';
import SideMenu     from '../components/side-menu-view';

/*
const FavoriteStatesNavigator = StackNavigator({
  StateList: { screen: StateList },
  SelectFavoriteStates: { screen: SelectFavoriteState },
}, {
  headerMode: 'none'
})
*/

const TimeLineNavigator = StackNavigator({
  TimeLineDetails: {screen: TimeLineView},
  StateDetails: { screen: StateDetails},
  FavoriteStates: { screen: StateList },
  SelectFavoriteStatesTimeLine: { screen: SelectFavoriteState },
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

const SettingsNavigator = StackNavigator({
  SettingsStart: { screen: Settings },  
  VesselLists: { screen: VesselLists},
  FavoriteStateSetting: { screen: SelectFavoriteState },  
}, {
  headerMode: 'none'
})

export const AppNavigator = DrawerNavigator({  
  // OverView: { screen: OverView },
  // Login : { screen: LoginView },  
  PortCalls: { screen: PortCallListNavigator },
  TimeLine: {screen: TimeLineNavigator},
  Home: { screen: Home },
  FavoriteStatesSideMenu: { screen: StateList },
  //FavoriteStates: { screen: FavoriteStatesNavigator },
  OverView: { screen: OverView },
  VesselInfo: { screen: VesselInfo },
  Settings: { screen: SettingsNavigator },
}, {
  headerMode: 'none',
  drawerWidth: 3*Dimensions.get('window').width/4, 
  contentComponent: SideMenu,
});

export const LoginNavigator = StackNavigator({
  Login: { screen: LoginView},
  App: { screen: AppNavigator }
}, {
  headerMode: 'none',
});


