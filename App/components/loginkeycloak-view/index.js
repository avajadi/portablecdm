import React, { Component } from 'react';
import {Constants, WebBrowser} from 'expo';
import { connect } from 'react-redux';

import {
    View,
    StyleSheet,
    Image,
    ScrollView,
    TouchableHighlight,
    Linking,
} from 'react-native';

import {
    Text,
    Button,
    FormLabel,
} from 'react-native-elements';

import colorScheme from '../../config/colors';
import styles from '../../config/styles';

const RedirectURI = __DEV__
? 'http://localhost:99/*'
  : 'https://redirect-with-params-vwlrmrqtzt.now.sh/facebook';
const MaritimeAuthURI = `https://staging-maritimeid.maritimecloud.net/auth/realms/MaritimeCloud/protocol/openid-connect/auth?client_id=0.1-urn%3Amrn%3Astm%3Aservice%3Ainstance%3Aviktoria%3Asummer-app&redirect_uri=${RedirectURI}&response_mode=fragment&response_type=code&scope=openid`


class LoginKeyCloakView extends Component {
    constructor(props) {
        super(props);

        // this.state = {

        // };

        this.onLoginPress = this.onLoginPress.bind(this);
    }

    onLoginPress = async () => {
        Linking.addEventListener('url', this.handleMaritimeRedirect);
        let result = await WebBrowser.openBrowserAsync(MaritimeAuthURI);
        console.log(`Result: ${result}`);
        Linking.removeEventListener('url', this.handleMaritimeRedirect);
    }

    handleMaritimeRedirect = async event => {
        WebBrowser.dismissBrowser();

        console.log(event.url);
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
