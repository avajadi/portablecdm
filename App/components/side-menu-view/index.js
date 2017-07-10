import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';

import { SideMenu } from 'react-native-elements';


export default class SideMenuView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Text>Hej, jag är en sidomeny förhoppningsvis</Text>
        );
    }

}