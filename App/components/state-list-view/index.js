import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button
} from 'react-native';

import { getDefaultStates } from '../../services/staterepo';

export default class StateList extends Component {
  static defaultProps = {
    selectedActor: {
      key: 'vessel', 
      displayName: 'Vessel'
    }
  }

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     states: getDefaultStates('vessel')
  //   };
  // }

  render() {
    const { params } = this.props.navigation.state;

    return(
      <View style={styles.container}>
        <FlatList
          data={getDefaultStates(params.selectedActor)}
          renderItem={({item}) => <StateListItem itemState={item} navigation={this.props.navigation}/>}
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