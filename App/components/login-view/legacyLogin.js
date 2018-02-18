import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    TouchableHighlight,
    Text,
} from 'react-native';
import {
    FormLabel,
    FormInput,
    CheckBox,
} from 'react-native-elements';

import colorScheme from '../../config/colors';

class LegacyLogin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            remember: props.rememberLogin,
        };
    }

    render() {
        return (
            <View>
                <FormLabel>Username</FormLabel>
                <FormInput
                    onChangeText={(username) => this.setState({username})}
                    value={this.state.username}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    />
                <FormLabel>Password</FormLabel>
                <FormInput
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    secureTextEntry
                    />
                <CheckBox
                    title="Remember me"
                    checked={this.state.remember}
                    onPress={() => this.setState({remember: !this.state.remember})}
                    containerStyle={styles.remember}
                    />
                <View style={styles.loginContainer}>
                    <TouchableHighlight 
                        style={styles.btnLogin} 
                        onPress={() => this.props.login(this.state)}>
                        <Text h3 style={styles.btnLoginTxt}>LOGIN</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    loginContainer: {
        alignItems: 'center',
    },
    remember: {
        backgroundColor: 'white',
        borderColor: 'transparent',
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


export default LegacyLogin;