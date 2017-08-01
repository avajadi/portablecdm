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

import { changeHostSetting, changePortSetting } from '../../actions';

class Settings extends Component {
  render() {
    const { navigate, state } = this.props.navigation;
    const { connection, changeHostSetting, changePortSetting } = this.props;

    return(
      <View style={styles.container}>
        <TopHeader title = 'Settings' firstPage navigation={this.props.navigation}/>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.formContainerStyle}>
          <Text style={styles.titleStyle}>Connection:</Text>
          <FormLabel>Host: </FormLabel>
          <FormInput 
            value={connection.host} 
            onChangeText={(text) => changeHostSetting(text)}
          />
          <FormLabel>Port: </FormLabel>
          <FormInput 
            value={connection.port}
            onChangeText={(text) => changePortSetting(text)}
          />
          </View>
          <Button
            color={colorScheme.primaryTextColor}
            title="Edit Favorite States"
            buttonStyle={styles.buttonStyle}
            onPress={() => navigate('FavoriteStateSetting')}
          />
          <Button
            backgroundColor={colorScheme.primaryColor}
            color={colorScheme.primaryTextColor}
            title="Edit Vessel Lists"
            buttonStyle={styles.buttonStyle}
            onPress={() => navigate('VesselLists')}
          />         
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 10,
    paddingTop: 10,
    borderColor: colorScheme.tertiaryTextColor, 
    borderWidth: 1,
    borderRadius: 5, 
  },
  buttonStyle: {
    backgroundColor: colorScheme.primaryColor,
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

export default connect(mapStateToProps, {changeHostSetting, changePortSetting})(Settings);