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

  sortRecentlyUsed(a, b) {
    let operations = this.props.operations;
    let recentlyUsed = [];

    if(operations.filter((x) => 
        x.at === a.URN ||
        x.from === a.URN ||
        x.to === a.URN
    ).length > 0) {
        return -1;
    }

    if(operations.filter((x) => 
    x.at === b.URN ||
    x.from === b.URN ||
    x.to === b.URN
    ).length > 0) {
        return 1;
    }

    return 0;
  }

  search(locations, searchTerm) {
      return locations.filter(location => location.name.toUpperCase().includes(searchTerm.toUpperCase())).sort((a, b) => this.sortRecentlyUsed(a,b));        
  }

  render() {
    const { selectLocationFor, selectLocation, navigation, onBackPress, locationType, locations } = this.props;
    
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
                  subtitle={`${location.locationType.replace(/_/g, " ")}`}
                  subtitleStyle={styles.subtitle}
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
  subtitle: {
      fontSize: 10,
  }
});

function mapStateToProps(state) {
  return {
    locations: state.location.locations,
    locationsByType: state.location.locationsByType,
    loading: state.location.loading,
    operations: state.portCalls.selectedPortCallOperations,
  }
}

export default connect(mapStateToProps, {selectLocation, fetchLocations})(LocationSelection);