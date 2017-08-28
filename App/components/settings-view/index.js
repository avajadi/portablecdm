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
  Button,
  CheckBox,
} from 'react-native-elements';

import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';
import styles from '../../config/styles';

import { changeHostSetting, changePortSetting, changePortUnlocode, changeFetchReliability } from '../../actions';

class Settings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fetchReliability: props.fetchReliability,
    }

    this.updateFetchReliability = this.updateFetchReliability.bind(this);
  }

  updateFetchReliability() {
    const { navigate } = this.props.navigation;
    this.setState({fetchReliability: !this.state.fetchReliability});
    this.props.changeFetchReliability(this.state.fetchReliability);
    console.log('Reliability: ' + this.state.fetchReliability);
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
          <CheckBox
            title='Fetch reliabilities'
            checked={!this.state.fetchReliability}
            onPress={this.updateFetchReliability}
          />
        </ScrollView>
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
    fetchReliability: state.settings.fetchReliability,
  };
}

export default connect(mapStateToProps, {changeHostSetting, changePortSetting, changePortUnlocode, changeFetchReliability})(Settings);