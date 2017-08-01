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
          <Text h4>Connection:</Text>
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
          <Button
            backgroundColor={colorScheme.primaryColor}
            color={colorScheme.primaryTextColor}
            title="Manage favorite states"
            onPress={() => navigate('FavoriteStateSetting')}
          />
          <Button
            backgroundColor={colorScheme.primaryColor}
            color={colorScheme.primaryTextColor}
            title="Manage Vessel Lists"
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
    paddingTop: 20,
  },
  titleStyle: {
    color: colorScheme.quaternaryTextColor,
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