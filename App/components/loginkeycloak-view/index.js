import React, { Component } from 'react';
import {Constants, WebBrowser} from 'expo';
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
} from 'react-native';

import {
    Text,
    Button,
    FormLabel,
    FormInput,
} from 'react-native-elements';

import {
    changeToken,
    fetchLocations,
    changeFetchReliability,
    changePortUnlocode,
    changeHostSetting,
    changePortSetting
  } from '../../actions';

import colorScheme from '../../config/colors';
import styles from '../../config/styles';
import constants from '../../config/constants';

class LoginKeyCloakView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            token: {
                accessToken: '',
                refreshToken: '',
                expiresIn: 0,
                idToken: '',
            },
            unlocode: props.connection.unlocode,
            host: props.connection.host,
            port: props.connection.port,
        };

        this.loginConfirmed = this.loginConfirmed.bind(this);
    }

    componentDidMount() {
        Linking.addEventListener('url', this.handleMaritimeRedirect);
    }

    onLoginPress = async () => {
        //let result = await WebBrowser.openBrowserAsync(constants.MaritimeAuthURI);

        /*DEVDEVDEV */
        this.handleMaritimeRedirect({url: '+/redirect'});
        //Linking.removeEventListener('url', this.handleMaritimeRedirect);
    }

    handleMaritimeRedirect = async event => {
        if(!event.url.includes('+/redirect')){
            return;
        }
        WebBrowser.dismissBrowser();

        console.log('Authenticating...');
        // const [, queryString] = event.url.split('#');
        // const responseObj = queryString.split('&').reduce((map, pair) => {
        //     const [key, value] = pair.split('=');
        //     map[key] = value;
        //     console.log("Value: " + value);
        //     return map;
        // }, {});

        // let payload = `code=${responseObj.code}&grant_type=authorization_code&client_id=${encodeURIComponent(ClientID)}&redirect_uri=${encodeURIComponent(RedirectURI)}`;

        // const response = await fetch(MaritimeTokenURI, {
        //     method: 'POST',
        //     headers: {
        //     'Content-type': 'application/x-www-form-urlencoded',
        //     },
        //     body: payload,
        //     credentials: 'include'
        // }).catch((error) => {
        //    console.error(error);
        // });

        // console.log(payload);
        // console.log('Response:');
        // console.log(response);
        
        // const result = await response.json();

        // if(response.status !== 200) {
        //     console.log('Unable to login: ' + result.error_description);
        //     Alert.alert(
        //         'Unable to login',
        //         result.error_description
        //     );
        //     return;
        // }
        
       //console.log(result);

       this.loginConfirmed();
    }

    loginConfirmed() {
        const { navigate } = this.props.navigation;
        this.props.changeToken(this.state.token);
        this.props.changePortUnlocode(this.state.unlocode);
        this.props.changeHostSetting(this.reformatHostHttp(this.state.host));
        this.props.changePortSetting(this.state.port);
        this.props.fetchLocations(); //Call last before navigate
        navigate('Application');
    }

    reformatHostHttp(rawHost) {
        if(!rawHost.startsWith("http"))
          return "http://" + rawHost;
        
        return rawHost;
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
                                placeHolder='UN/LOCODE for the PortCDM instance'
                                value={this.state.unlocode}
                                onChangeText={text => this.setState({unlocode: text})}
                            />
                            <View style={[styles.containers.flow]}>
                                <View>
                                    <FormLabel>Host: </FormLabel>
                                    <FormInput
                                        inputStyle={{width: 200, marginRight: 10}} 
                                        autoCorrent={false}
                                        placeholder="http://example.com"
                                        value={this.state.host} 
                                        onChangeText={(text) => this.setState({host: text})}
                                        />
                                </View>
                                <View>
                                    <FormLabel>Port: </FormLabel>
                                    <FormInput 
                                        inputStyle={{width: 75}}
                                        autoCorrent={false}
                                        keyboardType = 'numeric'
                                        value={this.state.port}
                                        onChangeText={(text) => this.setState({port: text})}
                                        />
                                </View>
                            </View>
                        </View>
                        <View style={styles.containers.blank}/>
                        <TouchableHighlight onPress={this.onLoginPress}>
                        <View style={styles.containers.subContainer}>
                            <Text h3 style={styles.fonts.white}>SEASWIN LOGIN</Text>
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
    }
  }

export default connect(mapStateToProps, {changeToken, changeFetchReliability, fetchLocations, changeHostSetting, changePortSetting, changePortUnlocode})(LoginKeyCloakView);
