import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Text
} from 'react-native';

import Orientation from 'react-native-orientation';

class BerthTimeLine extends Component {

    componentDidMount() {
        Orientation.lockToLandscape();
    }

    componentWillUnmount() {
        Orientation.unlockAllOrientations();
    }

    render() {
        
        return(
            <Text>This is the berth details view</Text>
        );
    }
}

const styles = StyleSheet.create({

});

function mapStateToProps (state) {
    return {

    };
}

export default connect(mapStateToProps, { })(BerthTimeLine);