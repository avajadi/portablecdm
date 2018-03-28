import React, { Component } from 'react';
import {Text, Dimensions} from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import LoginView            from '../components/login-view';
import SendPortCall         from '../components/send-portcall-view';
import StateList            from '../components/state-list-view';
import TimeLineView         from '../components/timeline-view';
import PortCallList         from '../components/portcall-list-view';
import FilterMenu           from '../components/portcall-list-view/sections/filterMenu';
import StateDetails         from '../components/timeline-view/sections/statedetails';
import VesselInfo           from '../components/vessel-info-view';
import Settings             from '../components/settings-view';
import LoginKeyCloakView    from '../components/loginkeycloak-view';
import SelectFavoriteState  from '../components/select-favorite-state-view';
import VesselLists          from '../components/vessel-lists-view';
import SideMenu             from '../components/side-menu-view';
import AboutView            from '../components/about-view';
import ErrorView            from '../components/error-view';
import BearthList           from '../components/berth-list-view';
import BerthList            from '../components/berth-list-view';
import BerthTimeLine        from '../components/berth-timeline-view';

const BerthViewNavigator = StackNavigator({
    BerthList: { screen: BearthList }, // THIS SHOULD BE FIRST!!
    BerthTimeLine: { screen: BerthTimeLine },
}, {
    headerMode: 'none'
});

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

const InitiatePortCallNavigator = StackNavigator({
    FavoriteStatesInit: { screen: StateList },
    SelectFavoriteStateInit: { screen: SelectFavoriteState },
    InitPortCall: { screen: SendPortCall },
}, {
    headerMode: 'none'
});

const MainNavigator = DrawerNavigator({
    PortCalls: { screen: PortCallListNavigator }, // THIS SHOULD BE FIRST!!
    Berths: { screen: BerthViewNavigator }, 
    TimeLine: {screen: TimeLineNavigator},
    FavoriteStatesSideMenu: { screen: StateList },
    FavoriteStatesInit: { screen: InitiatePortCallNavigator },
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
    LoginView: { screen: LoginView },
    //LoginKeyCloak: { screen: LoginKeyCloakView }, 
    Application: { screen: MainNavigator},
}, {
    headerMode: 'none',
});