import React from 'react';
import {Component} from 'react';
import {
    Button,
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions
} from 'react-native';

import portCDM from '../../services/backendservices';

export default class PortCallList extends Component {

    state = {
        portCalls: []
    }

    componentWillMount() {
        portCDM.getPortCalls()
            .then(result => result.json())
            .then(result => this.setState({portCalls: result}))
            .catch(portCallError => console.log(`Error in fetching all portcalls, ERRORMESSAGE: ${portCallError}`));
    }

    render() {
        const {navigate} = this.props.navigation;

        return(
            <View style={styles.container}> 
                <FlatList
                    data={this.state.portCalls}
                    keyExtractor={(item, index) => item.portCallId}
                    renderItem={({item}) => <PortCallViewItem portCall={item} />}
                />
            </View>
        );        
    }
}

class PortCallViewItem extends Component {
    constructor(props) {
        super(props);
        this.state = {portCall: props.portCall}
    }

    componentWillMount() {
        const {vesselId} = this.state.portCall;

        portCDM.getVessel(vesselId)
            .then(result => result.json())
            .then(vesselResult => {this.setState({vessel: vesselResult} ); return vesselResult})
            .catch(vesselError => console.log(`error getting vessel, ERRORMESSAGE: ${vesselError}`))
    }

    render() {
        const { portCall, vessel, vesselPhoto } = this.state;
        const {startTime} = portCall;

        if(!vessel) {
            return(
                <View></View>
            );
        }
        
        return (
            <View style={styles.portCallContainer}>
                <Text style={styles.portCallHeader}>{vessel.name}</Text>
                <Text style={styles.portCallInfo}>{startTime}</Text>
            </View>
        );
    
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    portCallContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    portCallHeader: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    portCallInfo: {
        color: 'lightgrey',
        fontSize: 20,

    }
})

