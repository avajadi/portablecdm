import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import ActorList from   '../components/actor-list-view';
import Home from '../components/home-view';
import MainMenu from    '../components/main-menu-view';

export const MainRouter = StackNavigator({
  Home: { screen: Home },
  ActorSelection: { screen: ActorList },
  MainMenu: { screen: MainMenu }
});