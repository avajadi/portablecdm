import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableWithoutFeedback,
    ListView,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native'

import { 
    List, 
    ListItem, 
    Icon,
    Text
} from 'react-native-elements';

import TopHeader from '../top-header-view';
import OperationView from './sections/operationview';

import { 
    fetchPortCallEvents, 
    changeFetchReliability, 
    removeError, 
    toggleFavoritePortCall,
    toggleFavoriteVessel,
} from '../../actions';
import { getTimeDifferenceString } from '../../util/timeservices';
import colorScheme from '../../config/colors';

const timer = null;
const portCallId = null;

class TimeLineView extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        
        this.state = {
            dataSource: ds.cloneWithRows(['row 1, row 2']),
            refreshing: false,
            showExpiredStates: false,
        }

        this.goToStateList = this.goToStateList.bind(this);
    }

    componentWillMount() {
        portCallId = this.props.portCallId;
        timer = setInterval(() => this.loadOperations, 60000);

        this.loadOperations = this.loadOperations.bind(this);
        if (!!portCallId)
            this.loadOperations();
    }

    loadOperations() {
        this.props.fetchPortCallEvents(portCallId).then(() => {
            if(this.props.error.hasError) {
                if(this.props.error.error.title == "RELIABILITY_FAIL") {
                    Alert.alert(
                        'Unable to fetch reliabilities!',
                        'It can easily be turned on or off in the settings. Would you like to turn it off now?',
                        [
                            {text: 'No', onPress: () => this.props.navigation.navigate('PortCalls'), style: 'cancel'},
                            {text: 'Yes', onPress: () => {
                                this.props.changeFetchReliability(false);
                                this.props.removeError();
                                this.loadOperations(); //Maybe dangerous?
                            }}
                        ],
                        {cancelable: false},
                    );
                } else {
                    this.props.navigation.navigate('Error');                   
                }
            }
        }); 
    }

    componentWillUnmount() {
        clearInterval(timer);
    }

    goToStateList = () => {
        this.props.navigation.navigate('FavoriteStates');
    }

    render() {
        const { loading, operations, vesselName } = this.props;
        const {params} = this.props.navigation.state;
        let { dataSource } = this.state;

        if(!loading) dataSource = dataSource.cloneWithRows(operations);

        return(
            <View style={{flex: 1, backgroundColor: colorScheme.primaryContainerColor}}>
                <TopHeader 
                    title = 'Timeline' 
                    firstPage
                    navigation={this.props.navigation} 
                    rightIconFunction={this.goToStateList}
                    leftIcons={this.createFavoriteIcons()}
                    selectorIcon={this.createShowHideExpiredIcon()}/>
                <View 
                    style={styles.headerContainer}
                >
                    <Text style={styles.headerText}>{vesselName}</Text>
                    {operations.reliability >= 0 && 
                        <Text style={styles.headerTitleText}><Text style={{fontWeight: 'bold'}}>Reliability: </Text>{operations.reliability}%</Text>
                    }
                </View>

                {loading && <ActivityIndicator 
                                color={colorScheme.primaryColor}
                                style={{alignSelf: 'center'}}
                                animating={loading}
                                size='large'/>}
            <ScrollView maximumZoomScale={10} alwaysBounceVertical={false}>
                {!loading && <ListView
                                enableEmptySections
                                dataSource={dataSource} 
                                refreshControl = {
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.loadOperations.bind(this)}
                                    />
                                }
                                renderRow={(data, sectionId, rowId) => {
                                    if (!this.state.showExpiredStates && data.isExpired) {
                                        return null;
                                    }
                                    if (data.isExpired) {
                                        let expiredMessage = 'This event has expired.';
                                        if (!data.warnings.some(w => w.message === expiredMessage)) {
                                            data.warnings.push({message: expiredMessage});
                                        }
                                    }
                                    if (typeof data == 'number') return null; // disgusting way to not handle operations.reliability as a member of the dataset for operations
                                    return <OperationView 
                                        operation={data}
                                        rowNumber={rowId}
                                        navigation={this.props.navigation}
                                        vesselName={vesselName}
                                        />
                                    }                
                                }
                            />
                }
            </ScrollView>
            </View>
        );
    }

    createShowHideExpiredIcon() {
        return {
            name: this.state.showExpiredStates ? 'remove-red-eye' : 'visibility-off',
            color: 'white',
            onPress: () => this.setState({showExpiredStates: !this.state.showExpiredStates}),
        };
    }
    
    createFavoriteIcons() {

        const { portCallId, imo } = this.props;

        let showStar = this.props.favoritePortCalls.includes(portCallId);
        let showBoat = this.props.favoriteVessels.includes(imo);

        return {
            first: {
                name: 'star',
                color: showStar ? 'gold' : 'gray',
                onPress: () => {
                    this.props.toggleFavoritePortCall(portCallId);
                }
            },
            second: {
                name: 'directions-boat',
                color: showBoat ? 'lightblue' : 'gray',
                onPress: () => {
                    this.props.toggleFavoriteVessel(imo);
                }
            }
        }
    } 
}


const styles = StyleSheet.create ({

    headerContainer: {
        backgroundColor: colorScheme.primaryColor,
        alignItems: 'center',

    },
    headerText: {
        textAlign: 'center',
        fontSize: 20,
        color: colorScheme.primaryTextColor,
    },
    headerTitleText: {
        textAlign: 'center',
        color: colorScheme.secondaryContainerColor,
        fontSize: 12,
   },
});



function mapStateToProps(state) {
    return {
        loading: state.portCalls.selectedPortCallIsLoading,
        operations: state.portCalls.selectedPortCallOperations,
        vesselName: state.portCalls.vessel.name,
        imo: state.portCalls.vessel.imo,
        portCallId: state.portCalls.selectedPortCall.portCallId,
        favoritePortCalls: state.favorites.portCalls,
        favoriteVessels: state.favorites.vessels,
        error: state.error,
        fetchReliability: state.settings.fetchReliability,
    };
}

export default connect(mapStateToProps, {
    changeFetchReliability, 
    fetchPortCallEvents, 
    removeError,
    toggleFavoritePortCall,
    toggleFavoriteVessel,
})(TimeLineView);




