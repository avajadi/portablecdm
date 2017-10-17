import React, { Component } from 'react';
import { Constants, WebBrowser } from 'expo';
import { connect } from 'react-redux';
import queryString from 'query-string';
import StaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';


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
    Platform,
    NavigatorIOS,
} from 'react-native';

import {
    Text,
    Button,
    FormLabel,
    FormInput,
    FormValidationMessage,
    Icon,
} from 'react-native-elements';

import {
    fetchLocations,
    changeFetchReliability,
    changePortUnlocode,
    changeHostSetting,
    changePortSetting,
    changeUser,
    loginKeycloak,
    removeError,
  } from '../../actions';

import colorScheme from '../../config/colors';
import styles from '../../config/styles';
import constants from '../../config/constants';

const window = Dimensions.get('window');
let server = null;

class LoginKeyCloakView extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
        if(this.props.error.hasError) {
            this.props.removeError();
            this.props.navigation.dispatch({
                type: 'Navigation/RESET',
                index: 0,
                actions: [
                    {
                        type: 'Navigate',
                        routeName: 'LoginKeyCloak',
                    }
                ],
            });
            return;
        }


        Linking.addEventListener('url', this.handleMaritimeRedirect);

        let path = '';
        if(Platform.OS === 'ios') {
            path = RNFS.MainBundlePath + '/www';
        } else {
            path = RNFS.DocumentDirectoryPath;
        }

        server = new StaticServer(1337, path, {localOnly: true});

        server.start().then((url) => {
            console.log('Serving at url ' + url + '. Path is ' + path);
        });
    }

    componentWillUnmount() {
        server.stop();
    }

    onLoginPress = async () => {
        let result = await WebBrowser.openBrowserAsync(constants(this.state.host.includes('dev.portcdm.eu')).MaritimeAuthURI);
    }

    handleMaritimeRedirect = async event => {
        if(!event.url.includes('/redirect')){
            return;
        }
        WebBrowser.dismissBrowser();
        Linking.removeEventListener('url', this.handleMaritimeRedirect);
        let isStaging = this.state.host.includes('dev.portcdm.eu');
        this.props.loginKeycloak(event.url, isStaging).then((result) => {
            if(result) this.loginConfirmed();
        });
    }

    loginConfirmed() {  
        server.stop();
        this.setState({legacyLogin: {enabled: false}});
        const { navigate, dispatch } = this.props.navigation;
        this.props.changePortUnlocode(this.state.unlocode);
        this.props.changeHostSetting(this.reformatHostHttp(this.state.host));
        this.props.changeUser(this.state.legacyLogin.username, this.state.legacyLogin.password);
        this.props.changePortSetting(this.state.port);
        this.setState({host: this.reformatHostHttp(this.state.host)});

        if(!this.validateForms()) return;

        this.props.fetchLocations().then(() => {
            if(this.props.error.hasError)
                navigate('Error');
        });

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

    renderLogos() {
        return (
            <View style={{flex: 0.4, alignItems: 'center'}}>
            <View style={[styles.containers.centralizer,styles.containers.flow]}> 
                <Image source={require('../../assets/stmLogo.jpg')} style={styles.images.logos.stm}/>
                <Image source={require('../../assets/riseLogo.png')} style={styles.images.logos.rise}/>
            </View>
            <Image source={require('../../assets/euCoFinance.png')} style={styles.images.logos.euCoFinance}/>
        </View>
        );
    }

    render() {
        return (
            <View style={{flex: 2}}>
                <ScrollView contentContainerStyle={styles.containers.main}>
                <Modal
                        animationType={'slide'}
                        transparent={false}
                        style={{backgroundColor: colorScheme.backgroundColor}}
                        visible={this.state.legacyLogin.enabled && this.state.validHost && this.state.validPort && this.state.validUnlocode}
                        onRequestClose={() => this.setState({legacyLogin: {enabled: false}})}
                        >
                        {(Platform.OS === 'ios') &&
                        <View style={{flexDirection: 'row'}}>
                            <Icon
                                name= 'arrow-back'
                                color= {colorScheme.secondaryColor}
                                size= {50}
                                style={{paddingLeft: 10, paddingTop: 40}}
                                underlayColor='transparent'
                                onPress={() => { this.setState({legacyLogin: {enabled: false}})}}
                            />
                        </View>
                        }
                        <View style={styles.containers.centralizer}>
                            <Text h3 style={{fontWeight: 'normal'}}>Legacy Login</Text>
                            <View style={styles.containers.blank}/>
                            <FormLabel>Username: </FormLabel>
                            <FormInput
                                autoCorrect={false}
                                inputStyle={{width: window.width * 0.3, textAlign: 'center'}}
                                value={this.state.legacyLogin.username}
                                onChangeText={text => this.setState({...this.state, legacyLogin: {...this.state.legacyLogin, username: text}})}
                            />
                            <FormLabel>Password: </FormLabel>
                            <FormInput
                                autoCorrect={false}
                                inputStyle={{width: window.width * 0.3, textAlign: 'center'}}
                                secureTextEntry
                                value={this.state.legacyLogin.password}
                                onChangeText={text => this.setState({...this.state, legacyLogin: {...this.state.legacyLogin, password: text}})}
                            />
                            <View style={styles.containers.blank}/>
                            <TouchableHighlight onPress={this.loginConfirmed}>
                            <View style={styles.containers.subContainer}>
                                <Text h3 style={styles.fonts.white}>LOGIN</Text>
                            </View>
                            </TouchableHighlight>
                        </View>
                        {/*this.renderLogos()*/}
                    </Modal>
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
                        <TouchableHighlight onPress={this.onLoginPress} onLongPress={() => {
                                this.validateForms();
                                this.setState({...this.state, legacyLogin: {...this.state.legacyLogin, enabled: true}});
                            }}>
                        <View style={styles.containers.subContainer}>
                            <Text h3 style={styles.fonts.white}>SEASWIM LOGIN</Text>
                        </View>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
                {this.renderLogos()}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
      connection: state.settings.connection,
      error: state.error,
    }
  }

export default connect(mapStateToProps, {removeError, loginKeycloak, changeFetchReliability, fetchLocations, changeHostSetting, changePortSetting, changeUser, changePortUnlocode})(LoginKeyCloakView);
