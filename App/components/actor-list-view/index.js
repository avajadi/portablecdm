import React, { Component, PropTypes } from 'react';
import { View,
         Text, 
         FlatList, 
         StyleSheet,
         Button,
         Dimensions,
         Alert } from 'react-native';

import existingActors from '../../config/actors';

export default class ActorList extends Component {
  static navigationOptions = {
    title: 'Choose your actor'
  };

  constructor() {
    super();
    this.state = {
      actors: existingActors        
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <FlatList
          data={this.state.actors} 
          renderItem={({item}) => <ActorListItem actor={item} navigation={this.props.navigation}/>}
        />               
      </View>
    );
  }
}

class ActorListItem extends Component {
  static propTypes = {
    actor: PropTypes.object.isRequired
  }

  render() {
    const { navigate } = this.props.navigation;
    return(
      <Button title={this.props.actor.displayName}
              onPress={() => navigate('StateSelection', {selectedActor: this.props.actor})} />
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})