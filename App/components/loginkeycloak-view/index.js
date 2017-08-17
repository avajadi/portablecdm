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
} from 'react-native-elements';

import colorScheme from '../../config/colors';
import styles from '../../config/styles';

const AuthURI = __DEV__ ? 'http://192.168.0.76:99/auth' 
    : 'null'; //TODO: Add link to expo redirect here

let RedirectURI = 'exp://z2-bby.pontusstjerna.app.exp.direct:80/+/redirect';
const MaritimeAuthURI = `https://staging-maritimeid.maritimecloud.net/auth/realms/MaritimeCloud/protocol/openid-connect/auth?client_id=0.1-urn%3Amrn%3Astm%3Aservice%3Ainstance%3Aviktoria%3Asummer-app&redirect_uri=${RedirectURI}&response_mode=fragment&response_type=code&scope=openid`
const MaritimeTokenURI = 'https://staging-maritimeid.maritimecloud.net/auth/realms/MaritimeCloud/protocol/openid-connect/token'

class LoginKeyCloakView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: '',
            accessToken: '',
            result: {},
        };

        this.onLoginPress = this.onLoginPress.bind(this);
    }

    componentDidMount() {
        Linking.addEventListener('url', this.handleMaritimeRedirect);
        console.log(Constants.linkingUrl);
    }

    onLoginPress = async () => {
        let result = await WebBrowser.openBrowserAsync(MaritimeAuthURI);
        //Linking.removeEventListener('url', this.handleMaritimeRedirect);
    }

    handleMaritimeRedirect = async event => {
        if(!event.url.includes('+/redirect')){
            return;
        }
        WebBrowser.dismissBrowser();

        console.log('Authenticating...');
        const [, queryString] = event.url.split('#');
        const responseObj = queryString.split('&').reduce((map, pair) => {
            const [key, value] =pair.split('=');
            map[key] = value;
            return map;
        }, {});
        
        console.log(responseObj.hello);

        const response = await fetch(MaritimeTokenURI, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=authorization_code&code=${responseObj.code}&redirect_uri=${RedirectURI}`
          }).catch((error) => {
              console.error(error);
          });

        console.log('Response:');
        console.log(response);
        
        const result = await response.json();

        if(response.status !== 200) {
            Alert.alert(
                'Unable to login',
                result.error_description
            );
        }
        
        console.log(result);

       //const { navigate } = this.props.navigation;
       //navigate('PortCalls');
    }

    render() {

        return (
            <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={styles.containers.main}>
                    <View style={styles.containers.centralizer}>
                        <Text h3>
                            <Text style={{fontWeight: 'normal'}}>Welcome to </Text> 
                            <Text style={{fontWeight: 'bold'}}>Port</Text>
                            <Text style={{fontWeight: 'normal'}}>able</Text>CDM
                        </Text>
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

export default LoginKeyCloakView
