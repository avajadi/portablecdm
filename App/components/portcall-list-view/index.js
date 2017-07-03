import React from 'react';
import {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Image,
    TextInput,
    TouchableHighlight,
    Modal,
    ScrollView

} from 'react-native';

import { 
    SearchBar, 
    Button, 
    List, 
    ListItem 
} from 'react-native-elements';

import TopHeader from '../top-header-view';

import portCDM from '../../services/backendservices';
import {getDateTimeString} from '../../util/timeservices';

export default class PortCallList extends Component {
    static navigationOptions = {
        header: <TopHeader title="PortCalls" />
    }

    state = {
        portCalls: [],
        searchTerm: '',
        modalVisible: false,
        showLoadingIcon: true
    }

    _showFilterModal = () => {this.setState({modalVisible: true})};
    _hideFilterModal = () => {this.setState({modalVisible: false})};

    componentDidMount() {
        this.fetchData()
            .then(portCalls => this.setState({portCalls: portCalls, showLoadingIcon: false}))
            .catch(portCallError => console.log(`Error in fetching all portcalls, ERRORMESSAGE: ${portCallError}`));
    }

    render() {
        const {navigation} = this.props;
        const {navigate} = navigation;
        const {portCalls, searchTerm} = this.state;

        return(
            <View style={styles.container}>
                {/*Render the search/filters header*/}
                <View style={{height: 75}}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                        <SearchBar
                            showLoadingIcon={this.state.showLoadingIcon}
                            containerStyle={{flex: 3}}
                            clearIcon
                            lightTheme
                            placeholder='Search'
                            onChangeText={text => this.setState({searchTerm: text})}
                        />
                        <Button
                            containerViewStyle={{flex: 1}}
                            small
                            title='Filters'
                        />                        
                    </View> 
                </View>

                {/*Render the List of PortCalls*/}
                <ScrollView>
                    <List>
                        {
                            this.search(portCalls, searchTerm).map( (portCall) => (
                                <ListItem
                                    roundAvatar
                                    avatar={{uri: portCall.vessel.photoURL}}
                                    key={portCall.portCallId}
                                    title={portCall.vessel.name}
                                    subtitle={getDateTimeString(new Date(portCall.startTime))}
                                    onPress={() => navigate('TimeLineDetails', {portCallId: portCall.portCallId})}
                                />
                            ))
                        }                    
                    </List>
                </ScrollView>
            </View>
        );        
    }

    search(portCalls, searchTerm) {
        return portCalls.filter(portCall => portCall.vessel.name.toUpperCase().startsWith(searchTerm.toUpperCase()));        
    }

    fetchData() {
        return portCDM.getPortCalls()
            .then(result => result.json())
            .then(portCalls => Promise.all(portCalls.map(portCall => {
                 return portCDM.getVessel(portCall.vesselId)
                    .then(result => result.json())
                    .then(vessel => {portCall.vessel = vessel; return portCall})
            })))
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerRow: {
        flexDirection: 'row',
        height: 40,
        marginTop: 10,
        marginBottom: 30,
        paddingLeft: 5,
        paddingRight: 5
    },
    searchBox: {
        flex: 3,
        height: 50
    },
    filterIcon: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    filterText: {
        fontSize: 20
    },
    list: {
        flex: 4
    }

})

