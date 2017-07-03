import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

export default class PortCallViewItem extends Component {
    constructor(props) {
        super(props);
        this.state = {portCall: props.portCall}
    }

    render() {
        const { navigate } = this.props.navigation;
        const { portCall } = this.state;
        const {startTime, vessel} = portCall;

        let startDateTime = new Date(startTime);
        let startDateString = startDateTime.toLocaleDateString();
        let startTimeString = startDateTime.toLocaleTimeString().slice(0, 5);

        if(!vessel) {
            return(
                <View></View>
            );
        }
        
        return (
          <TouchableHighlight
            onPress={() => navigate('TimeLineDetails', {portCallId: portCall.portCallId })}>
            <View style={styles.container}>
                <Image 
                    style={{width: 50, height: 50, borderRadius: 10}}
                    source={{uri: vessel.photoURL}}
                />
                <Text style={styles.header}>{vessel.name}</Text>
                <Text style={styles.infoText}>{startDateString} {startTimeString}</Text>
            </View>
          </TouchableHighlight>
        );
    
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    header: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    infoText: {
        color: 'grey',
        fontSize: 20,

    },
});