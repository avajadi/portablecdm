import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableWithoutFeedback,
    ListView
} from 'react-native'

// import TimeLine from 'react-native-timeline-listview';
import { 
    List, 
    ListItem, 
    Icon,
    Text
} from 'react-native-elements';

import renderIf from '../../util/renderif';
import portCDM from '../../services/backendservices';
import { getTimeDifferenceString } from '../../util/timeservices';
import colorScheme from '../../config/colors';
import TopHeader from '../top-header-view';
import OperationView from './sections/operationsview';

export default class TimeLineView extends Component {
    static navigationOptions = {
        header: <TopHeader title = 'Timeline' />
    }

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        
        this.state = {
            // operations: [],
            loading: true,
            dataSource: ds.cloneWithRows(['row 1, row 2'])
        }

        // this.state.dataSource = ds.cloneWithRows();

    }

    componentDidMount() {
        // const { params } = this.props.navigation.state;
        // const { portCallId } = params;
        const portCallId = 'urn:mrn:stm:portcdm:port_call:SEGOT:723d08b1-9bad-461c-9bf6-0820ab97f291';

        const { dataSource } = this.state;

        this.fetchData(portCallId)
            .then(this.sortOperations)
            .then(this.filterStatements)
            .then(this.addLocationsToOperations)
            .then(operations => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(operations), 
                    loading: false
                })
            })
            .catch(error => console.log(error));

    }

    render() {
        // const { operations } = this.state;

        return(
            <View>
                {!!this.state.loading && <Text>Loading!</Text>}
                {
                    !this.state.loading && <ListView
                                                enableEmptySections
                                                dataSource={this.state.dataSource} 
                                                renderRow={(data, sectionId, rowId) => <OperationView operation={data} rowNumber={rowId}/>}                
                                            />
                }
            </View>
        );
    }

    fetchData(portCallId) {
        return portCDM.getPortCallOperations(portCallId)
            .then(result => result.json());
    }

    addLocationsToOperations(operations) {
        return Promise.all(operations.map(async operation => {
            try {
                if(operation.at) {
                    operation.atLocation = await portCDM.getLocation(operation.at)
                                                .then(result => result.json());
                    
                }

                if(operation.from) {
                    operation.fromLocation = await portCDM.getLocation(operation.from)
                                                    .then(result => result.json());
                }

                if(operation.to) {
                    operation.toLocation = await portCDM.getLocation(operation.to)
                                                    .then(result => result.json());
                }
            } catch(error) {
                console.log(error);
            }finally {
                return operation;
            }
        }));
    }

    filterStatements(operations) {
        return Promise.all(operations.map(operation =>{
            let reportedStates = {};

            operation.statements.forEach(statement => {
                let stateDef = statement.stateDefinition;
                if(!reportedStates[stateDef]) {
                    reportedStates[stateDef] = [statement];
                 } else {
                    reportedStates[stateDef].push(statement);
                }
            });

            operation.reportedStates = reportedStates;
            return operation;
        }));
    }

    sortOperations(operations) {
        return operations.sort((a, b) => {
            let aTime = new Date(a.startTime);
            let bTime = new Date(b.startTime);

            if(aTime < bTime) return -1;
            if(aTime > bTime) return 1;
            else return 0;
        });
    }
}