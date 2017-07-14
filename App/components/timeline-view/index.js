import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableWithoutFeedback,
    ListView,
    ScrollView,
    ActivityIndicator
} from 'react-native'

import { 
    List, 
    ListItem, 
    Icon,
    Text
} from 'react-native-elements';

import portCDM from '../../services/backendservices';
import { fetchPortCallOperations } from '../../actions';
import { getTimeDifferenceString } from '../../util/timeservices';
import colorScheme from '../../config/colors';
import TopHeader from '../top-header-view';
import OperationView from './sections/operationsview';

class TimeLineView extends Component {
    static navigationOptions = {
        header: <TopHeader title = 'Timeline' />
    }

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        
        this.state = {
            dataSource: ds.cloneWithRows(['row 1, row 2'])
        }
    }

    componentWillMount() {
        const { portCallId } = this.props;
        this.props.fetchPortCallOperations(portCallId);
    }

    render() {
        const { loading, operations, vesselName } = this.props;
        const {params} = this.props.navigation.state;
        let { dataSource } = this.state;

        if(!loading) dataSource = dataSource.cloneWithRows(operations);

        return(
            <View style={{flex: 1, backgroundColor: colorScheme.primaryContainerColor}}>

                <View style={styles.headerContainer} >
                    <Text 
                        style={styles.headerText}
                        h4
                        > {vesselName}</Text>
                </View>

                {loading && <ActivityIndicator 
                                color={colorScheme.primaryColor}
                                style={{alignSelf: 'center'}}
                                animating={loading}
                                size='large'/>}
                {!loading && <ListView
                                enableEmptySections
                                dataSource={dataSource} 
                                renderRow={(data, sectionId, rowId) => <OperationView 
                                                                            operation={data} 
                                                                            rowNumber={rowId}
                                                                            navigation={this.props.navigation}
                                                                            vesselName={vesselName}
                                                                            />}                
                              />
                }
            </View>
        );
    }
}


const styles = StyleSheet.create ({

    headerContainer: {
        backgroundColor: colorScheme.primaryColor,
        alignItems: 'center',

    },
    headerText: {
       // fontWeight: 'bold',
        textAlign: 'center',
        color: colorScheme.primaryTextColor,
        
    },
});



function mapStateToProps(state) {
    return {
        loading: state.portCalls.selectedPortCallIsLoading,
        operations: state.portCalls.selectedPortCallOperations,
        vesselName: state.portCalls.vessel.name,
        portCallId: state.portCalls.selectedPortCall.portCallId
    };
}

export default connect(mapStateToProps, {fetchPortCallOperations})(TimeLineView);




