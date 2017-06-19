import React, { Component, PropTypes } from 'react';
import { View,
         Text, 
         FlatList, 
         StyleSheet,
         Button,
         Dimensions,
         Alert } from 'react-native';

import existingActors from '../config/actors';


export default class ActorListView extends Component {
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
          renderItem={({item}) => <ActorListItem actorName={item.key} navigation={this.props.navigation} />}
        />               
      </View>
    );
  }
}

class ActorListItem extends Component {
  static propTypes = {
    actorName: PropTypes.string.isRequired
  }

  render() {
    const { navigate } = this.props.navigation;

    return(
      <View style={styles.itemContainer}>
        <Button style={styles.itemButton} 
                title={this.props.actorName}
                onPress={() => navigate('MainMenu')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemContainer: {
    flex: 1
  },
  itemButton: {
    width: Dimensions.get('window').width
  }
})