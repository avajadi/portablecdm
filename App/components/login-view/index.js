import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  changeUser,
  fetchLocations,
  changeFetchReliability,
} from '../../actions';

import {
  View,
  StyleSheet,
} from 'react-native';

import {
  Text,
  Button,
  FormLabel,
  FormInput,
  CheckBox
} from 'react-native-elements';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';

import colorScheme from '../../config/colors';

class LoginView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: props.storeUserName,
      password: props.storePassword,
      fetchReliability: props.fetchReliability,
    }

    this.onContinuePress = this.onContinuePress.bind(this);
  }

  onContinuePress() {
    const { navigate } = this.props.navigation;
    this.props.changeUser(this.state.username, this.state.password);
    this.props.changeFetchReliability(this.state.fetchReliability);
    this.props.fetchLocations()
    navigate('App');
  }


  render() {
  

    return(
      <View style={styles.container}>

        <FormLabel>Username</FormLabel>
        <FormInput 
          value={this.state.username}
          onChangeText={text => this.setState({username: text})
        }/>
        <FormLabel style={{marginTop: 10}}>Password</FormLabel>
        <FormInput
          secureTextEntry
          value={this.state.password}
          onChangeText={text => this.setState({password: text})}
        />

        <Menu style={{marginTop: 30}}>
          <MenuTrigger text="Select portCDM instance" />
          <MenuOptions>
            <MenuOption value={10} text="test1" />
            <MenuOption value={10} text="test2" />
          </MenuOptions>
        </Menu>

        <CheckBox
          containerStyle={{
            backgroundColor: colorScheme.backgroundColor,
            borderWidth: 0,
            marginTop: 30
          }}
          title="Fetch reliability from server"
          iconRight
          right
          checked={this.state.fetchReliability}
          onPress={() => this.setState({fetchReliability: !this.state.fetchReliability})}
        />

        <Button 
          title="Continue" 
          disabled={this.state.username.length === 0 || this.state.password.length === 0}
          onPress={this.onContinuePress}
        />      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function mapStateToProps(state) {
  return {
    storeUserName: state.settings.connection.username,
    storePassword: state.settings.connection.password,
    fetchReliability: state.settings.fetchReliability
  }
}

export default connect(mapStateToProps, {changeUser, fetchLocations, changeFetchReliability})(LoginView);