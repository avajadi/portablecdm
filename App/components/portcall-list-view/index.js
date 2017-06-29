import React from 'react';
import {Component} from 'react';
import {
    Button,
    View
} from 'react-native';

export default class PortCallList extends Component {

    render() {
        const {navigate} = this.props.navigation;

        return(
            <View> 
                <Button 
                    title = 'Click here to go to Timeline'
                    onPress = { () => {navigate('TimeLineDetails', {portCallId: 'urn:mrn:stm:portcdm:port_call:SEGOT:9b028843-d7fb-4222-afbc-8f40c2710e5c'} )} }
                /> 

            </View>
        );        
    }


}

