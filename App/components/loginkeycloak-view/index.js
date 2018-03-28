import React, { Component } from 'react';
import { Constants, AuthSession } from 'expo';
import { connect } from 'react-redux';

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
    checkNewVersion,
    changeUser,
    loginKeycloak,
    removeError,
    fetchInstance,
  } from '../../actions';

import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';
import styles from '../../config/styles';
import constants from '../../config/constants';
import { APP_VERSION, STAGING, } from '../../config/version';

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
        if(this.props.error.hasError) { // Return from error
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

        if (false && __DEV__ && !!this.state.legacyLogin.username) {
            this.loginConfirmed();
        }

        if (this.props.checkNewVersion()) {
            Alert.alert(
                'New version',
                'Updated to new version ' + APP_VERSION + '. See changes in change log from About view.'
            );
        }
    }

    async onLoginPress() {
        // This is for the keycloak login
        this.props.changeHostSetting(this.reformatHostHttp(this.state.host));
        console.log('Redirect: ' + AuthSession.getRedirectUrl());
        const redirectUrl = AuthSession.getRedirectUrl();
        const consts = constants(true);
        const result = await AuthSession.startAsync({
            authUrl: consts.MaritimeAuthURI
        });

        if(result.type == 'success') {
            const authenticated = await this.props.loginKeycloak(result.params.code);
            if(authenticated) {
                this.loginConfirmed();
            }
        }
    }

    async loginConfirmed() {
        if (!this.state.legacyLogin.enabled) {
            this.setState({
                legacyLogin: {
                    username: '',
                    password: ''
                }
            });
        }

        this.setState({legacyLogin: {enabled: false}});
        const { navigate, dispatch } = this.props.navigation;
        this.props.changeHostSetting(this.reformatHostHttp(this.state.host));
        this.props.changePortUnlocode(this.state.unlocode);
        this.props.changeUser(this.state.legacyLogin.username, this.state.legacyLogin.password);
        this.props.changePortSetting(this.state.port);
        this.setState({host: this.reformatHostHttp(this.state.host)});

        if(!this.validateForms()) return;

        await this.props.fetchInstance();
        if (this.props.error.hasError) {
            navigate('Error');
        }

        this.props.fetchLocations().then(() => {
            console.log('fetched locations');
            if(this.props.error.hasError) {
                console.log('Inside if');
                navigate('Error');
            }
        });

        console.log('Logged in.');

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
          return "http://" + rawHost;

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
                {STAGING && <View style={{backgroundColor: 'red', marginTop: 30}}>
                    <Text style={{color: 'white', alignSelf: 'center'}}>DEV DEV DEV DEV DEV DEV DEV DEV DEV DEV</Text>
                </View>}
                <ScrollView contentContainerStyle={styles.containers.main}>
                <Modal
                        animationType={'slide'}
                        transparent={false}
                        style={{backgroundColor: colorScheme.backgroundColor}}
                        visible={this.state.legacyLogin.enabled && this.state.validHost && this.state.validPort && this.state.validUnlocode}
                        onRequestClose={() => this.setState({legacyLogin: {enabled: false}})}
                        >
                        <TopHeader modal title="Legacy Login" navigation={this.props.navigation} backArrowFunction={() => this.setState({legacyLogin: {enabled: false}})} />
                        
                        <View style={styles.containers.centralizer}>
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
                        <TouchableHighlight onPress={this.onLoginPress.bind(this)} onLongPress={() => {
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

export default connect(mapStateToProps, {
        removeError,
        loginKeycloak,
        changeFetchReliability,
        fetchLocations,
        changeHostSetting,
        changePortSetting,
        changeUser,
        changePortUnlocode,
        checkNewVersion,
        fetchInstance,
    })(LoginKeyCloakView);
