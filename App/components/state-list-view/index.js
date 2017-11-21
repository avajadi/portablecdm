import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Modal,
  ScrollView
} from 'react-native';

import {
  List,
  ListItem,
  Icon,
  CheckBox
} from 'react-native-elements';

import { connect } from 'react-redux';
import { removeFavoriteState, addFavoriteState, } from '../../actions'
import TopHeader from '../top-header-view';

class StateList extends Component {
  onAddStatesPress(init) {
    if (this.props.navigation.state.params) {
        this.props.navigation.navigate('SelectFavoriteStatesInit');
    } else {
        this.props.navigation.navigate('SelectFavoriteStatesTimeLine');
    }
  }

  render() {
    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;
    const { getState, stateCatalogue } = this.props;
    let favoriteStates = this.props.favoriteStates.sort((a,b) => (a < b ? -1 : 1));

    return(
      <View style={styles.container}>
        <TopHeader title="Favorite States" 
          navigation={this.props.navigation}
          rightIconFunction={this.onAddStatesPress.bind(this)} 
        />
        <ScrollView>
          <List>
              {favoriteStates.map((stateId, index) => {
              const state = getState(stateId);
              return (
                <ListItem
                  key={index}
                  title={state.Name}
                  onPress={() => {
                      if (this.props.navigation.state.params) {
                        navigate('InitPortCall', {stateId: state.StateId, newVessel: true});
                      } else {
                        navigate('SendPortCall', {stateId: state.StateId});
                      }
                    }}
                />
              );
            })} 
          </List>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

function mapStateToProps(state) {
  return {
    favoriteStates: state.states.favoriteStates,
    getState: state.states.stateById,
    stateCatalogue: state.states.stateCatalogue,
  }
}

export default connect(mapStateToProps, {removeFavoriteState, addFavoriteState})(StateList);