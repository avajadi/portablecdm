import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPortCalls, selectPortCall } from '../../actions';

import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';

import { 
    SearchBar, 
    Button, 
    List, 
    ListItem,
    Icon,
} from 'react-native-elements';

import colorScheme from '../../config/colors';
import TopHeader from '../top-header-view';
import { getDateTimeString } from '../../util/timeservices';

class PortCallList extends Component {   
    state = {
        searchTerm: '',
    }

    componentWillMount() {
        this.props.fetchPortCalls();
    }

    render() {
        const {navigation, showLoadingIcon, portCalls, selectPortCall} = this.props;
        const {navigate} = navigation;
        const {searchTerm} = this.state;

        return(
            <View style={styles.container}>
                <TopHeader title="Port Calls" navigation={this.props.navigation} firstPage/>
                {/*Render the search/filters header*/}
                <View style={styles.containerRow}>
                    <SearchBar
                        autoCorrent={false} 
                        containerStyle = {styles.searchBarContainer}
                        showLoadingIcon={showLoadingIcon}
                        clearIcon
                        inputStyle = {{backgroundColor: colorScheme.primaryContainerColor}}
                        lightTheme  
                        placeholder='Search'
                        placeholderTextColor = {colorScheme.tertiaryTextColor}
                        onChangeText={text => this.setState({searchTerm: text})}
                        textInputRef='textInput'
                    />
                    <Button
                        containerViewStyle={styles.buttonContainer}
                        small
                        icon={{
                            name: 'filter-list',
                            size: 30,
                            color: colorScheme.primaryTextColor,
                            style: styles.iconStyle,
                        }}
                        backgroundColor = {colorScheme.primaryColor} 
                        onPress= {() => navigate('FilterMenu')}
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
                                    titleStyle={styles.titleStyle}
                                    subtitle={getDateTimeString(new Date(portCall.startTime))}
                                    subtitleStyle={styles.subTitleStyle}
                                    onPress={() => {
                                        selectPortCall(portCall);
                                        navigate('TimeLine')
                                    }}
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorScheme.primaryColor  
    },
    // Search bar and filter button  
    containerRow: {
        flexDirection: 'row',
        alignItems:'center',
        marginTop: 10,
        paddingLeft: 15,
        paddingRight: 0,
    },
    searchBarContainer: {
        backgroundColor: colorScheme.primaryColor,
        flex: 4,
        marginRight: 0,
        borderBottomWidth: 0,
        borderTopWidth: 0,      
    },
    // Filter button container 
    buttonContainer: {
        flex: 1,
        marginRight: 0,
        marginLeft: 0,
        alignSelf: 'stretch',
    },
    iconStyle: {
        alignSelf: 'stretch',
    },
    titleStyle: {
        color: colorScheme.quaternaryTextColor,
    },
    subTitleStyle: {
        color: colorScheme.tertiaryTextColor,
    }, 
})

function mapStateToProps(state) {
    return {
        portCalls: state.portCalls.foundPortCalls,
        showLoadingIcon: state.portCalls.portCallsAreLoading,
    }
}

export default connect(mapStateToProps, {fetchPortCalls, selectPortCall})(PortCallList);

