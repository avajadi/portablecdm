import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import SideMenu from 'react-native-side-menu';
import reducers from './reducers';

import {AppNavigator, StackNav} from './navigators/appnavigator';

class App extends Component {
  render() {
    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
        
        <AppNavigator />
      </Provider>
    );
  }
}

export default App;