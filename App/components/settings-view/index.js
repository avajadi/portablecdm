import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';

import {
  Text,
  Icon,
  List,
  ListItem,
  FormInput,
  FormLabel,
  Button
} from 'react-native-elements';

import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';
import styles from '../../config/styles';

import { changeHostSetting, changePortSetting, changePortUnlocode } from '../../actions';

class Settings extends Component {

  logout() {
    console.log('Logging out...');
  }


  render() {
    const { navigate, state } = this.props.navigation;
    const { connection, changeHostSetting, changePortSetting, changePortUnlocode } = this.props;

    return(
      <View style={locStyles.container}>
        <TopHeader title = 'Settings' firstPage navigation={this.props.navigation}/>
        <ScrollView style={locStyles.scrollContainer}>
          <Button
            backgroundColor={colorScheme.primaryColor}
            color={colorScheme.primaryTextColor}
            title="Edit Favorite States"
            buttonStyle={locStyles.buttonStyle}
            onPress={() => navigate('FavoriteStateSetting')}
          />
          <Button
            backgroundColor={colorScheme.primaryColor}
            color={colorScheme.primaryTextColor}
            title="Edit Vessel Lists"
            buttonStyle={locStyles.buttonStyle}
            onPress={() => navigate('VesselLists')}
          />         
        </ScrollView>
        <Button
            backgroundColor={'red'}
            color={colorScheme.primaryTextColor}
            title='Logout'
            buttonStyle={locStyles.buttonStyle}
            onPress={this.logout}
            />
      </View>
    );
  }
}

const locStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme.backgroundColor,
  },
  scrollContainer: {
    backgroundColor: colorScheme.backgroundColor,
 //   paddingTop: 20,
  },
  formContainerStyle: {
    backgroundColor: colorScheme.primaryContainerColor,
    margin: 10,
    paddingBottom: 10,
    paddingTop: 10,
    borderColor: colorScheme.tertiaryTextColor, 
    borderWidth: 1,
    borderRadius: 5, 
  },
  buttonStyle: {
    //backgroundColor: colorScheme.primaryColor,
    marginBottom: 10,
    marginTop: 10,
    borderColor: colorScheme.primaryColor, 
    borderWidth: 1,
    borderRadius: 5, 
  },
  titleStyle: {
    color: colorScheme.quaternaryTextColor,
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  badgeText: {
    color: colorScheme.secondaryColor,
  },
});

function mapStateToProps(state) {
  return {
    connection: state.settings.connection,
  };
}

export default connect(mapStateToProps, {changeHostSetting, changePortSetting, changePortUnlocode})(Settings);