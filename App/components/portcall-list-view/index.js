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

    componentDidMount() {
        portCDM.getPortCalls()
            .then(result => result.json())
            .then(result => this.setState({portCalls: result}))
            .catch(error => console.log(`Error in fetching all portcalls, ERRORMESSAGE: ${error}`));
    }

    render() {
        const {navigate} = this.props.navigation;

        return(
            <View style={styles.container}> 
                <FlatList
                    data={this.state.portCalls}
                    keyExtractor={(item, index) => item.portCallId}
                    renderItem={({item}) => <PortCallViewItem portCall={item}/>}
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

    // async getVessel(vesselId) {

    // }

    componentWillMount() {
        const { portCall } = this.props;
        portCDM.getVessel(portCall.vesselId)
            .then(result => result.json())
            // .then(result => console.log(result))
            .then(result => this.setState({vessel: result}))
            .catch(error => console.log(`Error fetching vessel in PortCallViewItem, ERRORMESSAGE: ${error}`))
    }

    render() {
        const { portCall, vessel } = this.state;
        return (
            <Text>{vessel.name}</Text>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

