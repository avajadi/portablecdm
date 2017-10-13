import React, { Component } from 'react';
import {Text, Dimensions} from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import SendPortCall from '../components/send-portcall-view';
import StateList    from '../components/state-list-view';
import PortCallList from '../components/portcall-list-view';
import TimeLineView from '../components/timeline-view';
import FilterMenu   from '../components/portcall-list-view/sections/filterMenu';
import StateDetails from '../components/timeline-view/sections/statedetails';
import VesselInfo   from '../components/vessel-info-view';
import Settings     from '../components/settings-view';
import LoginKeyCloakView from '../components/loginkeycloak-view';
import SelectFavoriteState from '../components/select-favorite-state-view';
import VesselLists from '../components/vessel-lists-view';
import SideMenu     from '../components/side-menu-view';
import AboutView    from '../components/about-view';
import ErrorView from '../components/error-view';

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

const MainNavigator = DrawerNavigator({
  PortCalls: { screen: PortCallListNavigator },
  TimeLine: {screen: TimeLineNavigator},
  FavoriteStatesSideMenu: { screen: StateList },
  VesselInfo: { screen: VesselInfo },
  Settings: { screen: SettingsNavigator },
  About: { screen: AboutView },
  Error: { screen: ErrorView },
}, {
  headerMode: 'none',
  drawerWidth: 3*Dimensions.get('window').width/4, 
  contentComponent: SideMenu,
});

export const AppNavigator  = StackNavigator({
  LoginKeyCloak: { screen: LoginKeyCloakView },
  Application: { screen: MainNavigator}
}, {
  headerMode: 'none',
});