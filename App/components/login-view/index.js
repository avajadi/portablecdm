import React, { Component } from 'react';
import { Constants, AuthSession } from 'expo';
import { connect } from 'react-redux';
import ModalDropdown from 'react-native-modal-dropdown';

import {
    View,
    Text,
    Image,
    StyleSheet,
    Picker,
    Dimensions,
    TouchableHighlight,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';

import {
    FormInput,
    FormLabel,
    Icon,
} from 'react-native-elements';

import LegacyLogin from './legacyLogin';
import Logos from './logos';

import { 
    changeHostSetting, 
    loginKeycloak,
    fetchInstance,
    changeUser,
    fetchLocations,
    removeError,
    checkNewVersion,
} from '../../actions';

import { APP_VERSION, STAGING } from '../../config/version';
import { hasKeycloak } from '../../config/instances';
import constants from '../../config/constants';
import colorScheme from '../../config/colors';

import logo from '../../assets/login-view.png';

const dimensions = Dimensions.get('window');

class LoginView extends Component {

    constructor(props) {
        super(props);

        const { hosts, connection } = props;

        this.state = {
            host: connection.host,
            addHostVisible: hosts.length === 0,
            addHostIconName: 'keyboard-arrow-down',
            forceLegacy: true,
            loggingIn: false,
            showLogo: true,
            showDropdown: false,
        };

        this.startApplication = this.startApplication.bind(this);
    }


    componentDidMount() {
        console.log('PortableCDM started. Width: ' + 
            dimensions.width + 'px, height: ' + dimensions.height + 'px');

        if (this.props.checkNewVersion()) {
            Alert.alert(
                'New version',
                'Updated to new version ' + APP_VERSION + '. See changes in change log from About view.'
            );
        }

        if(this.props.error.hasError) { // Return from error
            this.props.navigation.dispatch({
                type: 'Navigation/RESET',
                index: 0,
                actions: [
                    {
                        type: 'Navigate',
                        routeName: 'LoginView',
                    }
                ],
            });

            this.props.removeError();
            return;
        }

        if (this.props.rememberLogin && !this.props.error.hasError) {
            this.login();
        }
    }

    addHostPress() {
        if (this.state.addHostVisible && this.state.host) {
            if (this.state.host.length > 0) {
                this.props.changeHostSetting(this.reformatHostHttp(this.state.host));
                this.setState({
                    addHostVisible: false,
                    host: this.reformatHostHttp(this.state.host),
                });
            } else {
                this.setState({
                    addHostVisible: false,
                    host: this.props.connection.host,
                })
            }
        } else {
            this.setState({
                addHostVisible: true,
            });
        }
    }

    toggleDropdown() {
        if (this.state.addHostIconName === 'keyboard-arrow-down') {
            if (this.state.showDropdown) {
                this.dropdown.hide();
            } else {
                this.dropdown.show();
            }
            this.setState({showDropdown: !this.state.showDropdown});
        }
    }

    showLogo(showLogo) {
        this.setState({showLogo});
    }

    loginLegacy({ username, password, remember }) {
        this.props.changeHostSetting(this.state.host);
        this.props.changeUser(username, password, remember);
        this.login();
    }

    async loginKeycloak() {
        this.props.changeHostSetting(this.state.host);
        this.props.changeUser('', '', false);
        console.log('Redirect: ' + AuthSession.getRedirectUrl());
        const redirectUrl = AuthSession.getRedirectUrl();
        const consts = constants(true);
        const result = await AuthSession.startAsync({
            authUrl: consts.MaritimeAuthURI
        });

        if(result.type == 'success') {
            const authenticated = await this.props.loginKeycloak(result.params.code);
            if(authenticated) {
                this.login();
            }
        }
    }

    startApplication() {
        this.props.fetchLocations().then(() => {
            console.log('fetched locations');
            if(this.props.error.hasError) {
                this.props.navigation.navigate('Error');
            }
        });

        this.props.navigation.navigate('Application');
    }

    async login() {
        const { navigate, dispatch } = this.props.navigation;
        this.setState({loggingIn: true});

        await this.props.fetchInstance();
        if (this.props.error.hasError) {
            Alert.alert(
                'Unable to fetch instance info!', 
                'Would you like to proceed anyway? Some functionality might not work correctly.',
                [
                    {text: 'No', onPress: () => navigate('Error')},
                    {text: 'Yes', onPress: () => {
                        this.props.removeError();
                        this.startApplication();
                    }}    
                ]
            );
        } else {
            this.startApplication();
        }
    }

    reformatHostHttp(host) {
        if (host.includes('http')) {
            return host.split('://')[1];
        }

        return host;
    }

    render() {
        if (this.props.rememberLogin || 
            this.props.navigation.state.params || 
            this.state.loggingIn) {
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator color={colorScheme.primaryColor} size='large' />
                </View>
            );
        }

        const { hosts, rememberLogin } = this.props;
        const { addHostVisible } = this.state;
        const keycloak = false;

        return (
            <View style={styles.mainContainer}>
                { false && 
                    <View style={{backgroundColor: 'red', marginTop: 30}}>
                        <Text style={{color: 'white', alignSelf: 'center'}}>DEV DEV DEV DEV DEV DEV DEV DEV DEV DEV</Text>
                    </View>
                }
                {this.state.showLogo && 
                <View style={{backgroundColor: colorScheme.primaryColor, elevation: 16}}>
                    <Image 
                        style={styles.logo} 
                        source={logo} />
                </View>
                }
                
                <View style={styles.contentContainer}>
                    <View>
                        <View style={styles.hostContainer}>
                            {(hosts.length > 0 && !addHostVisible) &&
                            <View style={{flexDirection: 'row'}}>
                                <ModalDropdown
                                    ref={dropdwn => this.dropdown = dropdwn}
                                    style={styles.dropdownHost}
                                    textStyle={styles.dropdownHostText}
                                    dropdownStyle={styles.dropdownHost}
                                    dropdownTextStyle={{fontSize: 15,}}
                                    options={hosts}
                                    defaultValue={this.state.host}
                                    accessible={false}
                                    onSelect={(index, value) => this.setState({
                                        host: value,
                                        forceLegacy: false,
                                    })}
                                    onDropdownWillShow={() => this.addHostPress()}
                                />
                                <Icon 
                                color={colorScheme.primaryColor}
                                name={'keyboard-arrow-down'}
                                size={35}
                                iconStyle={styles.btnAddHost}
                                onPress={() => this.toggleDropdown()}
                                />
                            </View>
                            }
                            {addHostVisible && 
                            <FormInput 
                                ref={hostTxt => {
                                    if (hostTxt && hosts.length > 0) {
                                        hostTxt.focus();
                                    }
                                }}
                                containerStyle={styles.hostTxtContainer}
                                onChangeText={text => this.setState({host: text})} 
                                autoCorrect={false}
                                spellCheck={false}
                                placeholder={'Enter a host'}
                                autoCapitalize={'none'}
                                onBlur={() => this.addHostPress()}
                                />
                            }
                        </View>
                    </View>
                    {keycloak &&
                        <View style={styles.loginContainer}>
                            <TouchableHighlight 
                                style={styles.btnLogin} 
                                onPress={() => this.loginKeycloak()}
                                onLongPress={() => this.setState({forceLegacy: true})}
                                >
                                <Text h3 style={styles.btnLoginTxt}>SEASWIM LOGIN</Text>
                            </TouchableHighlight>
                        </View>
                    }
                    {!keycloak &&
                        <LegacyLogin 
                        login={(username, password) => this.loginLegacy(username, password)}
                        showLogo={(val) => this.showLogo(val)}
                        rememberLogin={rememberLogin} 
                    />
                    }
                    <Logos />
                </View>
                <View style={{backgroundColor: 'white', height: 3000}} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    logo: {
        width: dimensions.width,
        //height: dimensions.width * 0.6669,
        height: dimensions.height * 0.4,
        backgroundColor: colorScheme.primaryColor,
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: colorScheme.primaryColor,
    },
    contentContainer: {
        paddingLeft: 30,
        paddingRight: 30,
        height: dimensions.height * 0.6,
        justifyContent: 'space-between',
        backgroundColor: 'white',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowRadius: 3,
        shadowOpacity: 1.0,
    },
    hostContainer: {
        paddingTop: 20,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    btnAddHost: {
        marginRight: 0,
    }, 
    dropdownHost: {
        padding: 10,
    },
    dropdownHostText: {
        fontSize: 22,
    },
    hostTxtContainer: {
        width: dimensions.width / 2,
    },
    loginContainer: {
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 50,
    },
    btnLogin: {
        backgroundColor: colorScheme.primaryColor,
    },
    btnLoginTxt: {
        marginLeft: 30,
        marginRight: 30,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 22,
        color: 'white',      
        fontWeight: 'bold',  
    }
  });
  

function mapStateToProps(state) {
    return {
        connection: state.settings.connection,
        rememberLogin: state.settings.rememberLogin,
        hosts: state.settings.hosts,
        error: state.error,
    }
}

export default connect(mapStateToProps, {
    changeHostSetting,
    fetchInstance,
    changeUser,
    loginKeycloak,
    fetchLocations,
    removeError,
    checkNewVersion,
    })(LoginView);
