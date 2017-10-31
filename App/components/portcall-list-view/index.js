import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
    updatePortCalls, 
    selectPortCall,
    toggleFavoritePortCall,
    toggleFavoriteVessel,
 } from '../../actions';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Alert,
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
        refreshing: false,
    }

    componentWillMount() {
        this.loadPortCalls = this.loadPortCalls.bind(this);
        this.loadPortCalls();
    }

    loadPortCalls() {
        this.props.updatePortCalls().then(() => {
            if(this.props.error.hasError)
                navigate('Error');
        });
    }

    checkBottom({layoutMeasurement, contentOffset, contentSize}) {
        const paddingToBottom = 20;
        if(layoutMeasurement.height - contentOffset.y >= contentSize.height - paddingToBottom) {
            console.log('Need to fetch more port calls!');
        }
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
                        autoCorrect={false} 
                        containerStyle = {styles.searchBarContainer}
                        showLoadingIcon={showLoadingIcon}
                        clearIcon
                        inputStyle = {{backgroundColor: colorScheme.primaryContainerColor}}
                        lightTheme  
                        placeholder='Search by name, IMO or MMSI number'
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
                <ScrollView
                    refreshControl={
                        <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.loadPortCalls.bind(this)}
                    />
                    }
                    onScroll={({nativeElement}) => {
                     //   this.checkBottom(nativeElement);
                    }}
                    >
                    <List>
                        {
                            
                            this.search(portCalls, searchTerm).map( (portCall) => ( 
                                <ListItem
                                    roundAvatar
                                    avatar={{uri: portCall.vessel.photoURL}}
                                    key={portCall.portCallId}
                                    title={portCall.vessel.name}
                                    badge={{element: this.renderFavorites(portCall)}}
                                    titleStyle={styles.titleStyle}
                                    subtitle={getDateTimeString(new Date(portCall.startTime))}
                                    subtitleStyle={styles.subTitleStyle}
                                    onPress={() => {
                                        //console.log(JSON.stringify(portCall.vessel)); 
                                        selectPortCall(portCall);
                                        navigate('TimeLine')
                                    }}
                                    onLongPress={() => {
                                        Alert.alert(
                                            'Favorite ' + portCall.vessel.name,
                                            'What would you like to do?',
                                            [
                                                {text: 'Cancel'},
                                                {
                                                    text: 
                                                        (this.props.favoriteVessels.includes(portCall.vessel.imo) ? 'Unf' : 'F') +
                                                        'avorite vessel', 
                                                    onPress: () => {
                                                        this.props.toggleFavoriteVessel(portCall.vessel.imo);
                                                }},
                                                {
                                                    text: 
                                                        (this.props.favoritePortCalls.includes(portCall.portCallId) ? 'Unf' : 'F') +
                                                    'avorite port call', onPress: () => {
                                                    this.props.toggleFavoritePortCall(portCall.portCallId);
                                                }}
                                            ]
                                        );
                                    }}
                                />
                            ))
                        }                    
                    </List>
                </ScrollView>
            </View>
        );        
    }

    renderFavorites(portCall) {
        let showStar = this.props.favoritePortCalls.includes(portCall.portCallId);
        let showBoat = this.props.favoriteVessels.includes(portCall.vessel.imo);
        return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {showStar && <Icon
                        name='star'
                        color='gold'
                    />}
                    {showBoat && <Icon
                        name='directions-boat'
                        color='lightblue'
                    />}
                </View>
        );
    } 

    sortFavorites(a,b) {
        if(this.props.favoritePortCalls.includes(a.portCallId) || this.props.favoriteVessels.includes(a.vessel.imo))
            return -1;
        
        if(this.props.favoritePortCalls.includes(b.portCallId) || this.props.favoriteVessels.includes(b.vessel.imo))
            return 1;


        return 0;
    }

    search(portCalls, searchTerm) {
        return portCalls.filter(portCall => {
            return portCall.vessel.name.toUpperCase().startsWith(searchTerm.toUpperCase()) || 
            portCall.vessel.imo.split('IMO:')[1].startsWith(searchTerm) ||
            portCall.vessel.mmsi.split('MMSI:')[1].startsWith(searchTerm);
        }).sort((a,b) => this.sortFavorites(a,b));        
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
        portCalls: state.cache.portCalls,
        favoritePortCalls: state.favorites.portCalls,
        favoriteVessels: state.favorites.vessels,
        showLoadingIcon: state.portCalls.portCallsAreLoading,
        error: state.error,
    }
}

export default connect(mapStateToProps, {
    updatePortCalls, 
    selectPortCall,
    toggleFavoritePortCall,
    toggleFavoriteVessel,
})(PortCallList);

