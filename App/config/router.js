import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import ActorListView from '../components/actorlistview';
import StartButton from '../components/startbutton';
import MenuScreen from '../components/menuscreen';

export const StackNav = StackNavigator({
  Home: { screen: StartButton },
  ActorListView: { screen: ActorListView },
  MainMenu: { screen: MenuScreen }
});