import React from 'react';
import {Component} from 'react';
import {
    Button,
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Image,
    TextInput,
    TouchableHighlight,
    Modal,

} from 'react-native';

import PortCallViewItem from './portcallviewitem';
import FilterMenu from './filtermenu';

import Filter from '../../model/filter';
import portCDM from '../../services/backendservices';

export default class PortCallList extends Component {

    state = {
        portCalls: [],
        searchTerm: '',
        modalVisible: false,
    }

    _showFilterModal = () => {this.setState({modalVisible: true})};
    _hideFilterModal = () => {this.setState({modalVisible: false})};

    componentDidMount() {
        this.fetchData()
            .then(portCalls => this.setState({portCalls: portCalls}))
            .catch(portCallError => console.log(`Error in fetching all portcalls, ERRORMESSAGE: ${portCallError}`));
    }

    render() {
        const {navigation} = this.props;
        const {portCalls, searchTerm} = this.state;
        return(
            <View style={styles.container}>
                <View style={styles.containerRow}>
                    <TextInput                        
                        style={styles.searchBox}
                        placeholder='Search'
                        onChangeText={text => this.setState({searchTerm: text})}
                    />
                    <TouchableHighlight 
                        style={styles.filterIcon}
                        onPress={this._showFilterModal}>
                        <Text style={styles.filterText}>Filters</Text>
                    </TouchableHighlight>
                </View> 
                <FlatList
                    style={styles.list}
                    data={this.search(portCalls, searchTerm)}
                    extraData={this.state}
                    keyExtractor={(item, index) => item.portCallId}
                    renderItem={({item}) => <PortCallViewItem portCall={item} navigation={navigation}/>}
                />
                <Modal
                    animationType={'fade'}
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={this._hideFilterModal}>

                    <FilterMenu 
                        filters={new Filter()}
                        onApplyFilters={this.applyFilters.bind(this)}
                    />

                </Modal>
            </View>
        );        
    }

    /**
     * 
     * @param {Filter} filters 
     *  The filters that should be used for fetching portcalls
     */
    applyFilters(filters) {
        console.log('In applyFilters!!!');
        console.log(filters);
        this.fetchData(filters)
            .then(portCalls => this.setState({portCalls: portCalls}))
            .catch(portCallError => console.log(`Error in fetching all portcalls, ERRORMESSAGE: ${portCallError}`));
        this._hideFilterModal();
    }

    search(portCalls, searchTerm) {
        return portCalls.filter(portCall => portCall.vessel.name.toUpperCase().startsWith(searchTerm.toUpperCase()));        
    }

    fetchData(filters) {
        return portCDM.getPortCalls(filters)
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

})

