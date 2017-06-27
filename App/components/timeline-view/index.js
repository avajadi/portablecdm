import React, {Component} from 'react';
import {
    View ,
    Text,
} from 'react-native';

import {
    PortCDMConfig
} from '../../config/portcdmconfig';


export default class TimeLine extends Component {
 
    state = {
        definitionId: 'Visit'
    }

    componentWillMount() {
                fetch(PortCDMConfig.endpoints.PCBS.port_call('urn:mrn:stm:portcdm:port_call:SEGOT:111722cd-904c-4f01-b6b9-fe8a109d80b8'),
           {headers: {
                'Content-Type': 'application/xml',
                'X-PortCDM-UserId': PortCDMConfig.user.name,
                'X-PortCDM-Password': PortCDMConfig.user.password,
                'X-PortCDM-APIKey': 'eeee'
            },
            }
        )
            .then(result => (result.json()) )
            .then(result => (this.setState({definitionId: result[0].definitionId})) )  
            //.then(result => console.log(result[1]))
           // .then(result => definitionId = result[0].definitionId);
    }

    render() {


        return(
            <View>
                <Text> Nicoles katt heter Bella. .</Text>
                <Text> Johans katt heter Kattsson.</Text>
                <Text> {this.state.definitionId} </Text>
            </View>
        )


    } 


}