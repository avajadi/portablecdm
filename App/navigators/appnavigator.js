import React, { Component } from 'react';
import {Text} from 'react-native';
import { StackNavigator } from 'react-navigation';


import ActorList    from '../components/actor-list-view';
import Home         from '../components/home-view';
import MainMenu     from '../components/main-menu-view';
import SendPortCall from '../components/send-portcall-view';
import StateList    from '../components/state-list-view';
import PortCallList from '../components/portcall-list-view';
import TimeLineView from '../components/timeline-view';
//import TopHeader    from '../components/top-header-view';

export const AppNavigator = StackNavigator({
  PortCallList: { screen: PortCallList,
                  header: (headerProps) => <Text>HEJSAN</Text>
  }, 
  TimeLineDetails: {screen: TimeLineView},
  Home: { screen: Home },  
  ActorSelection: { screen: ActorList },
  MainMenu: { screen: MainMenu },
  SendPortCall: { screen: SendPortCall },
  StateSelection: { screen: StateList },
});