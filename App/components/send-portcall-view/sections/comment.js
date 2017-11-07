import React, { Component } from 'react';
import { connect } from 'react-redux';

import { selectLocation, fetchLocations } from '../../../actions';

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
        <View>
          
        </View>
      );
    }
  }
  
  export default (LocationSelection);