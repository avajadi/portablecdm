import React, { Component } from 'react';
import {Text} from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';


import ActorList    from '../components/actor-list-view';
import Home         from '../components/home-view';
import MainMenu     from '../components/main-menu-view';
import SendPortCall from '../components/send-portcall-view';
import StateList    from '../components/state-list-view';
import PortCallList from '../components/portcall-list-view';
import TimeLineView from '../components/timeline-view';
import FilterMenu   from '../components/portcall-list-view/sections/filterMenu';
import StateDetails from '../components/timeline-view/sections/statedetails';



export const AppNavigator = StackNavigator({
  PortCallList: { screen: PortCallList }, 
  StateDetails: { screen: StateDetails},
  TimeLineDetails: {screen: TimeLineView},
  Home: { screen: Home },  
  ActorSelection: { screen: ActorList },
  MainMenu: { screen: MainMenu },
  SendPortCall: { screen: SendPortCall },
  StateSelection: { screen: StateList },
  FilterMenu: {screen: FilterMenu},

});
