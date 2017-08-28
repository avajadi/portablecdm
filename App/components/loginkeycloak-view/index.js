import React, { Component } from 'react';
import { Constants, WebBrowser } from 'expo';
import { checkForCertification } from '../../util/certification'
import { connect } from 'react-redux';
import queryString from 'query-string';

import {
    View,
    StyleSheet,
    Image,
    ScrollView,
    TouchableHighlight,
    Linking,
    Alert,
    Dimensions,
    Modal,
} from 'react-native';

import {
    Text,
    Button,
    FormLabel,
    FormInput,
    FormValidationMessage,
} from 'react-native-elements';

import {
    changeToken,
    fetchLocations,
    changeFetchReliability,
    changePortUnlocode,
    changeHostSetting,
    changePortSetting,
    changeUser,
  } from '../../actions';

import colorScheme from '../../config/colors';
import styles from '../../config/styles';
import consts from '../../config/constants';

const window = Dimensions.get('window');

let constants = {};

class LoginKeyCloakView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            token: {
                accessToken: '',
                idToken: '',
                refreshExpiresIn: 0,
                refreshToken: '',
                tokenType: '',
            },
            unlocode: props.connection.unlocode,
            host: props.connection.host,
            port: props.connection.port,
            legacyLogin: {
                username: props.connection.username,
                password: props.connection.password,
                enabled: false,
            },
            validUnlocode: true,
            validHost: true,
            validPort: true,
        };

        this.loginConfirmed = this.loginConfirmed.bind(this);
    }

    componentDidMount() {
        Linking.addEventListener('url', this.handleMaritimeRedirect);
    }

    onLoginPress = async () => {
        constants = consts(this.state.host.includes('dev.portcdm.eu') || this.state.host.includes('qa.portcdm.eu'));
        let result = await WebBrowser.openBrowserAsync(constants.MaritimeAuthURI);
    }

    handleMaritimeRedirect = async event => {
        if(!event.url.includes('+/redirect')){
            return;
        }
        WebBrowser.dismissBrowser();
        Linking.removeEventListener('url', this.handleMaritimeRedirect);

        console.log('Authenticating...');
        const [, queryString] = event.url.split('#');
        const responseObj = queryString.split('&').reduce((map, pair) => {
            const [key, value] = pair.split('=');
            map[key] = value;
            return map;
        }, {});

        let params = {
            code: responseObj.code,
            grant_type: 'authorization_code',
            client_id: constants.ClientID,
            redirect_uri: constants.RedirectURI
        };

        var formBody = []

        for(var property in params) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(params[property]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        const response = await fetch(constants.MaritimeTokenURI, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'bearer',
                'Content-type': 'application/x-www-form-urlencoded',
            },
            body: formBody,
            credentials: 'include'
        }).catch((error) => {
           console.error(error);
        });
        
        const result = await response.json();

        if(response.status !== 200) {
            console.log('Unable to login: ' + result.error_description);
            Alert.alert(
                'Unable to login',
                result.error_description
            );
            return;
        }
        
       console.log('Authentication successful');

       this.setState({token: {
           accessToken: result['access_token'],
           idToken: result['id_token'],
           refreshExpiresIn: result['reshresh_expires_in'],
           refreshToken: result['refresh_token'],
           tokenType: result['token_type'],
       }});
       this.loginConfirmed();
    }

    loginConfirmed() {
        this.setState({legacyLogin: {enabled: false}});
        const { navigate } = this.props.navigation;
        this.props.changeToken(this.state.token);
        this.props.changePortUnlocode(this.state.unlocode);
        this.props.changeHostSetting(this.reformatHostHttp(this.state.host));
        this.props.changeUser(this.state.legacyLogin.username, this.state.legacyLogin.password);
        this.props.changePortSetting(this.state.port);
        this.setState({host: this.reformatHostHttp(this.state.host)});

        if(!this.validateForms()) return;

        if(!this.props.fetchLocations())  //Call last before navigate
            navigate('Error');
        else
            navigate('Application');
    }

    validateForms() {
        this.setState({validUnlocode: !!this.state.unlocode});
        this.setState({validHost: !!this.state.host && this.state.host.includes('.')});
        this.setState({validPort: !!this.state.port});

        return this.state.validUnlocode && this.state.validHost && this.state.validPort;
    }

    reformatHostHttp(rawHost) {
        if(!rawHost.startsWith("http"))
          return "https://" + rawHost;
        
        return rawHost;
      }

    renderInvalidUnlocode() {
        if(!this.state.validUnlocode) {
            return (
                <FormValidationMessage>
                UN/LOCODE is invalid!
                </FormValidationMessage>
            );
        }

        return null;
    }

    renderInvalidHost() {
        if(!this.state.validHost) {
            return (
                <FormValidationMessage>
                Invalid host!
                </FormValidationMessage>
            );
        }

        return null;
    }

    renderInvalidPort() {
        if(!this.state.validPort) {
            return (
                <FormValidationMessage>
                Invalid port!
                </FormValidationMessage>
            );
        }

        return null;
    }

    render() {
        return (
            <View style={{flex: 2}}>
                <ScrollView contentContainerStyle={styles.containers.main}>
                    <View style={styles.containers.centralizer}>
                        <Text h3>
                            <Text style={{fontWeight: 'normal'}}>Welcome to </Text> 
                            <Text style={{fontWeight: 'bold'}}>Port</Text>
                            <Text style={{fontWeight: 'normal'}}>able</Text>CDM
                        </Text>
                        <View style={styles.containers.blank}/>
                        <View>
                            <FormLabel>UN/LOCODE: </FormLabel>
                            <FormInput
                                autoCorrect={false}
                                inputStyle={{width: window.width * 0.8}}
                                placeHolder='UN/LOCODE for the PortCDM instance'
                                value={this.state.unlocode}
                                onChangeText={text => this.setState({unlocode: text})}
                            />
                            {this.renderInvalidUnlocode()}
                            <View style={[styles.containers.flow, {justifyContent: 'center'}]}>
                                <View>
                                    <FormLabel>Host: </FormLabel>
                                    <FormInput
                                        inputStyle={{width: window.width * 0.6, paddingRight: window.width * 0.1}} 
                                        autoCorrect={false}
                                        placeholder="http://example.com"
                                        value={this.state.host} 
                                        onChangeText={(text) => this.setState({host: text})}
                                        />
                                    {this.renderInvalidHost()}
                                </View>
                                <View>
                                    <FormLabel>Port: </FormLabel>
                                    <FormInput 
                                        inputStyle={{width: window.width * 0.2}}
                                        autoCorrect={false}
                                        keyboardType = 'numeric'
                                        value={this.state.port}
                                        onChangeText={(text) => this.setState({port: text})}
                                        />
                                    {this.renderInvalidPort()}
                                </View>
                            </View>
                        </View>
                        <View style={styles.containers.blank}/>
                        <TouchableHighlight onPress={this.onLoginPress}> 
                        <View style={styles.containers.subContainer}>
                            <Text h3 style={styles.fonts.white}>SEASWIM LOGIN</Text>
                        </View>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
                <View style={{flex: 0.4, alignItems: 'center'}}>
                    <View style={[styles.containers.centralizer,styles.containers.flow]}> 
                        <Image source={require('../../assets/stmLogo.jpg')} style={styles.images.logos.stm}/>
                        <Image source={require('../../assets/riseLogo.png')} style={styles.images.logos.rise}/>
                    </View>
                    <Image source={require('../../assets/euCoFinance.png')} style={styles.images.logos.euCoFinance}/>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
      connection: state.settings.connection,
      token: state.settings.token,
    }
  }

export default connect(mapStateToProps, {changeToken, changeFetchReliability, fetchLocations, changeHostSetting, changePortSetting, changeUser, changePortUnlocode})(LoginKeyCloakView);
