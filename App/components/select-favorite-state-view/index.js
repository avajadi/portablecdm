import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Modal,
  ListView
} from 'react-native';

import {
  List,
  ListItem,
  Icon,
  CheckBox
} from 'react-native-elements';

import MiniHeader from '../mini-header-view';


class SelectFavoriteState extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      stateDataSource: ds.cloneWithRows(props.stateCatalogue),
      chosenStates: []
    }

  }

  render() {
    return(
      <View style={styles.container}>
        <MiniHeader navigation={this.props.navigation} title='Change favorite states' />
        <List>
          <ListView
            dataSource={this.state.stateDataSource}
            renderRow={(stateDefinition => {
              return (
                <ListItem
                  key={stateDefinition.stateId}
                  title={stateDefinition.Name}
                />
              );
            })}
          />
        </List>
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
    stateCatalogue: state.states.stateCatalogue
  }
}

export default connect(mapStateToProps)(SelectFavoriteState);