import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button
} from 'react-native';

import { getDefaultStates, getState } from '../../services/staterepo';

export default class StateList extends Component {
  static defaultProps = {
    selectedActor: {
      key: 'vessel', 
      displayName: 'Vessel'
    }
  }

  _keyExtractor = (item, index) => item;

  render() {
    const { params } = this.props.navigation.state;
    const { navigation } = this.props;

    return(
      <View style={styles.container}>
        <FlatList
          keyExtractor={this._keyExtractor}
          data={getDefaultStates(params.selectedActor)}
          renderItem={({item}) => <StateListItem itemState={getState(item)} navigation={navigation} />}
        />
      </View>
    );
  }
}

class StateListItem extends Component {
  render() {
    const {navigate} = this.props.navigation;

    return(
      <Button 
        title={this.props.itemState.name}
        onPress={() => {navigate('SendPortCall', {selectedState: this.props.itemState})}} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});