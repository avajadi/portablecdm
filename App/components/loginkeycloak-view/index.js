import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    View,
    StyleSheet,
    Image,
} from 'react-native';

import {
    Text,
    Button,
    FormLabel,
} from 'react-native-elements';

import colorScheme from '../../config/colors';

class LoginKeyCloakView extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {

        return (
            <View style={styles.container}>
                <FormLabel>Test!</FormLabel>
            </View>
        );
    }
}