import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
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
import colorScheme from '../../config/colors';

class StateList extends Component {
  onAddStatesPress(init) {
    if (!!this.props.navigation.state.params) {
        this.props.navigation.navigate('SelectFavoriteStateInit');
    } else {
        this.props.navigation.navigate('SelectFavoriteStatesTimeLine');
    }
  }

  render() {
    const { navigate, state } = this.props.navigation;
    const initNew = !!state.params;
    const { getState, stateCatalogue } = this.props;
    let favoriteStates = this.props.favoriteStates.sort((a,b) => (a < b ? -1 : 1));

    return(
      <View style={styles.container}>
        <TopHeader title={initNew ? 'Create port call' : 'Favorite States'}
          navigation={this.props.navigation}
          firstPage={initNew}
          rightIconFunction={this.onAddStatesPress.bind(this)} 
        />
        <View style={styles.headerContainer} >
          <Text style={styles.headerSubText}>Select state</Text>
        </View>
        <ScrollView>
          <List>
              {favoriteStates.map((stateId, index) => {
              const state = getState(stateId);
              return (
                <ListItem
                  key={index}
                  title={state.Name}
                  onPress={() => {
                      if (initNew) {
                        navigate('InitPortCall', {stateId: state.StateId, newVessel: true});
                      } else {
                        navigate('SendPortCall', {stateId: state.StateId, newVessel: false});
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
  headerContainer: {
    backgroundColor: colorScheme.primaryColor,
    alignItems: 'center',
    flexDirection: 'column',
    },
    headerSubText: {
        textAlign: 'center',
        color: colorScheme.primaryTextColor,
        fontSize: 18,
        fontWeight: 'bold',
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