import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';

import {AppNavigator, StackNav} from './navigators/appnavigator';

class App extends Component {
  render() {
    return (
      <Provider store={createStore(reducers)}>
        <StackNav />
      </Provider>
    );
  }
}

export default App;