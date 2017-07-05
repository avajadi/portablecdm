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
    ListItem,
    Icon 
} from 'react-native-elements';

import colorScheme from '../../config/colors';
import TopHeader from '../top-header-view';
import portCDM from '../../services/backendservices';
import {getDateTimeString} from '../../util/timeservices';

export default class PortCallList extends Component {
    static navigationOptions = {
        header: <TopHeader title="PortCalls" firstPage={true}/>
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

//alignItems: 'center'

        return(
            <View style={styles.container}>
                {/*Render the search/filters header*/}
                <View style={{flexDirection: 'row'}}>
                    <SearchBar 
                        containerStyle = {styles.containerStyle}
                        showLoadingIcon={this.state.showLoadingIcon}
                        clearIcon
                        inputStyle = {{backgroundColor: colorScheme.primaryContainerColor}}
                        lightTheme  
                        placeholder='Search'
                        placeholderTextColor = {colorScheme.tertiaryTextColor}
                        onChangeText={text => this.setState({searchTerm: text})}
                    />
                    <Button
                        containerViewStyle={{flex: 1, marginRight: 0, marginLeft: 0, alignSelf: 'stretch'}}
                        small    // Tror inte den här gör något
                        icon={{
                            name: 'filter-list',
                            size: 30,
                            color: colorScheme.primaryTextColor,
                            style: {
                                alignSelf: 'stretch'
                            },
                        }}
                        backgroundColor = {colorScheme.primaryColor} 
                        //title='Filters'
                        color = {colorScheme.primaryTextColor}
                        fontSize={10}
                    /> 
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
        backgroundColor: colorScheme.primaryColor  // Har denna grå färgen lite brunt i sig? 
    },
    containerStyle: {
        backgroundColor: colorScheme.primaryColor,
        flex: 4,
        marginRight: 0,
        borderBottomWidth: 0,
        borderTopWidth: 0,      

    }
    // containerRow: {
    //     flexDirection: 'row',
    //     height: 40,
    //     marginTop: 10,
    //     marginBottom: 30,
    //     paddingLeft: 5,
    //     paddingRight: 5,
    // },
    // searchBox: {
    //     flex: 3,
    //     height: 50,
    // },
    // filterIcon: {
    //     flex: 1,
    //     alignItems: 'center',
    //     justifyContent: 'center'
    // },
    // filterText: {
    //     fontSize: 20,
    // },
    // list: {
    //     flex: 4,
    // }

})

