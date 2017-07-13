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
        const { params } = this.props.navigation.state;
        const { portCallId } = params;
        // const { dataSource } = this.state;
        this.props.fetchPortCallOperations(portCallId);
    }

    render() {
        // const { operations } = this.state;
        const { loading, operations } = this.props;
        let { dataSource } = this.state;

        console.log(this.props);

        dataSource = dataSource.cloneWithRows(operations);
        

        return(
            <View style={{flex: 1, backgroundColor: colorScheme.primaryContainerColor}}>
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
                                                                            rowNumber={rowId}/>}                
                              />
                }
            </View>
        );
    }
}

function mapStateToProps(state) {
    console.log(state.portCalls.selectedPortCallOperations);
    return {
        loading: state.portCalls.selectedPortCallIsLoading,
        operations: state.portCalls.selectedPortCallOperations
    };
}

export default connect(mapStateToProps, {fetchPortCallOperations})(TimeLineView);
