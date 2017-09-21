import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  changeUser,
  fetchLocations,
  changeFetchReliability,
  changePortUnlocode,
  changeHostSetting,
  changePortSetting
} from '../../actions';

import {
  View,
  StyleSheet,
  ScrollView,
  Image
} from 'react-native';

import {
  Text,
  Button,
  FormLabel,
  FormInput,
  CheckBox
} from 'react-native-elements';

import colorScheme from '../../config/colors';

class LoginView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: props.connection.username,
      password: props.connection.password,
      unlocode: props.connection.unlocode,
      host: props.connection.host,
      port: props.connection.port,
      fetchReliability: props.fetchReliability,
    }

    this.onContinuePress = this.onContinuePress.bind(this);
  }

  onContinuePress() {
    const { navigate } = this.props.navigation;
    this.props.changeUser(this.state.username, this.state.password);
    this.props.changePortUnlocode(this.state.unlocode);
    this.props.changeHostSetting(this.reformatHostHttp(this.state.host));
    this.props.changePortSetting(this.state.port);
    this.props.changeFetchReliability(this.state.fetchReliability);
    this.props.fetchLocations(); //Call last before navigate
    navigate('PortCalls');
  }

  reformatHostHttp(rawHost) {
    if(!rawHost.startsWith("http"))
      return "http://" + rawHost;
    
    return rawHost;
  }


  render() {
    const connection = this.props.connection;

    return(
      <ScrollView contentContainerStyle={styles.container}>
        <Text h3><Text style={{fontWeight: 'bold'}}>Port</Text><Text style={{fontWeight: 'normal'}}>able</Text>CDM</Text>

        <View
          style={styles.partContainer}
        >
          <FormLabel>Username</FormLabel>
          <FormInput
            autoCorrent={false}
            placeholder="Type in your username" 
            value={this.state.username}
            onChangeText={text => this.setState({username: text})
          }/>
          <FormLabel>Password</FormLabel>
          <FormInput
            autoCorrent={false}
            secureTextEntry
            placeholder="Type in your password" 
            value={this.state.password}
            onChangeText={text => this.setState({password: text})}
          />
        </View>

        <View
          style={styles.partContainer}
        >
          <FormLabel>UN/LOCODE: </FormLabel>
            <FormInput
              autoCorrent={false}
              placeholder="UN/Locode for the portCDM instace" 
              value={this.state.unlocode}
              onChangeText={text => this.setState({unlocode: text})}
            />
            <FormLabel>Host: </FormLabel>
            <FormInput 
              autoCorrent={false}
              placeholder="Host adress for the portCDM instance"
              value={this.state.host} 
              onChangeText={(text) => this.setState({host: text})}
            />
            <FormLabel>Port: </FormLabel>
            <FormInput 
              autoCorrent={false}
              placeholder="Port for the portCDM instance"
              value={this.state.port}
              onChangeText={(text) => this.setState({port: text})}
            />
          </View>

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
      </ScrollView>
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
  partContainer: {
    borderWidth: 1,
    borderColor: colorScheme.primaryColor,
    borderRadius: 30
  }
});

function mapStateToProps(state) {
  return {
    fetchReliability: state.settings.fetchReliability,
    connection: state.settings.connection,
  }
}

export default connect(mapStateToProps, {changeUser, fetchLocations, changeFetchReliability, changeHostSetting, changePortSetting, changePortUnlocode})(LoginView);