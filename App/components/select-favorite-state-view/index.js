import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  View,
  StyleSheet,
  ListView,
  FlatList,
} from 'react-native';

import {
  Icon,
  CheckBox,
  Button,
  Text,
  SearchBar
} from 'react-native-elements';

import MiniHeader from '../mini-header-view';
import colorScheme from '../../config/colors';
import { replaceFavoriteStates } from '../../actions';


class SelectFavoriteState extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.chosenStates.length !== r2.chosenStates.length});

    this.state = {
      chosenStates: [...props.favoriteStates],
      searchTerm: '',
    }
    this.state.stateDataSource = ds.cloneWithRows(props.stateCatalogue);
    this.replaceFavoriteStates = this.replaceFavoriteStates.bind(this);
  }

  replaceFavoriteStates () {
    this.props.replaceFavoriteStates(this.state.chosenStates);
  }

  onBackIconPressed () {
    console.log("onbackiconpressed");
    this.props.navigation.goBack();
  }

  search(states, searchTerm) {
    return states.filter(state => state.Name.toUpperCase().startsWith(searchTerm.toUpperCase()));        
  }

  render() {
    const { addFavoriteState, removeFavoriteState } = this.props;
    const { chosenStates } = this.state;

    return(
      <View style={styles.container}>
        <MiniHeader 
          navigation={this.props.navigation} title='Favorite states'
          rightIconFunction={this.replaceFavoriteStates.bind(this)}
          leftIconFunctioN={this.onBackIconPressed.bind(this)}
        />
        <SearchBar 
          containerStyle = {styles.searchBarContainer}
          inputStyle = {{backgroundColor: colorScheme.primaryContainerColor}}
          lightTheme  
          placeholder='Search'
          placeholderTextColor = {colorScheme.tertiaryTextColor}
          onChangeText={text => this.setState({searchTerm: text})}
          textInputRef='textInput'
        />
        <FlatList
          data={this.search(this.props.stateCatalogue, this.state.searchTerm)}
          extraData={this.state}
          keyExtractor={(item, index) => index}
          renderItem={({item}) => {
            return (
              <CheckBox
                iconRight
                right
                title={item.Name}
                checked={this.state.chosenStates.indexOf(item.StateId) >= 0}
                onPress={() => {
                    const indexOfState = this.state.chosenStates.indexOf(item.StateId);
                     
                    if (indexOfState < 0) {
                      this.setState({chosenStates: [...this.state.chosenStates, item.StateId]})
                    } else {
                      this.setState({chosenStates: this.state.chosenStates.filter((item, index) => index !== indexOfState)})
                    }                      
                  }
                }
              />
            );
          }}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchBarContainer: {
    backgroundColor: colorScheme.primaryColor,
    marginRight: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0,      
  },
});

function mapStateToProps(state) {
  return {
    favoriteStates: state.states.favoriteStates,
    getState: state.states.stateById,
    stateCatalogue: state.states.stateCatalogue
  }
}

export default connect(mapStateToProps, {replaceFavoriteStates})(SelectFavoriteState);