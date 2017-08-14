import React, { Component } from 'react';
import { AsyncStorage, ActivityIndicator, View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import express from 'express';

import {fetchLocations} from './actions';

import reducers from './reducers';
import colorScheme from './config/colors';

import {LoginNavigator, AppNavigator} from './navigators/appnavigator';

const store = compose(autoRehydrate(), applyMiddleware(ReduxThunk))(createStore)(reducers);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rehydrated: false,
    }

  }

  componentWillMount() {
    let persistore = persistStore(store, {whitelist: ['states', 'settings', 'filters'], storage: AsyncStorage}, () => {
      this.setState({rehydrated: true})
    });
    // persistore.purge();
  }


  render() {
    if(!this.state.rehydrated) {
      return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator color={colorScheme.primaryColor} size='large' /></View>
    } else {
        return (
          <Provider store={store}>
            <AppNavigator />
         </Provider>
        );
    }
  }
}

// app.get('/*', (req, res) => {

//   console.log('Request!');

//   let qs = req._parsedUrl.query;
//   if (process.env.NODE_ENV === 'development') {
//     res.redirect('exp://192.168.0.80:19000/+auth/?' + qs);
//   } else {
//       //TODO!
//     //res.redirect('exp://exp.host/@community/with-facebook-auth/+redirect/?' + qs);
//   }
// });

// // app.get('/', (req, res) => {
// //   res.sendFile('facebook.html', {root: __dirname });
// // });

// app.listen(99);

export default App;