import React, { Component } from 'react';
import { connect } from 'react-redux';

import { selectLocation, fetchLocations } from '../../../actions';

import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,

} from 'react-native';

import {
  Text,
  SearchBar,
  List,
  ListItem
} from 'react-native-elements';

import MiniHeader from '../../mini-header-view';
import colorScheme from '../../../config/colors';

class LocationSelection extends Component {
  state = {
    searchTerm: '',
  }

  search(locations, searchTerm) {
    return locations.filter(location => location.name.toUpperCase().startsWith(searchTerm.toUpperCase()));        
  }

  render() {
    const { selectLocationFor, selectLocation, navigation, onBackPress, locationType } = this.props;
    const locations = locationType ? 
                      this.props.locations.filter(location => location.locationType === locationType) : 
                      this.props.locations;
    return(
      <View style={styles.container}>
        <MiniHeader 
          navigation={navigation}
          title="Select Location" 
          leftIconFunction={onBackPress}
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
        <ScrollView>
          {(locations.length <= 0) && <ActivityIndicator animating={!locations} size="large" style={{alignSelf: 'center'}}/>}
          {(locations.length > 0) && <List>
            {this.search(locations, this.state.searchTerm).map(location => {
              return(
                <ListItem
                  key={location.URN}
                  title={location.name}
                  onPress={() => {
                      selectLocation(selectLocationFor, location);
                      onBackPress();
                    }
                  }
                />
              );
            })}
          </List>}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    locations: state.location.locations,
    loading: state.location.loading,
  }
}

export default connect(mapStateToProps, {selectLocation, fetchLocations})(LocationSelection);