import React, { Component } from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';

import {
    List,
    ListItem,
} from 'react-native-elements';

import StatementView from '../statementview';
import colorScheme from '../../../../config/colors';

class ConflictingDataView extends Component {

    
    render() {
        const { operation, warning } = this.props;
        const statements = operation.statements.filter(statement => warning.references.some(ref => ref.refId === statement.messageId));
        const timeDiff = warning.indicatorValues.find(val => val.type === 'TIME_DIFF').value;
        return (
            <View style={styles.mainContainer}>
                <Text style={styles.header}>
                        Conflicting statements for {statements[0].stateDefinition.replace(/_/g, ' ')}
                </Text>
                <Text style={styles.description}>
                    <Text style={{fontWeight: 'bold'}}>Time difference: </Text>
                    {timeDiff + ' min'}
                </Text>
                <ScrollView>
                    {statements.map(statement => <StatementView key={statement.messageId} statement={statement} />)}
                    <View style={{height: 300}} /> 
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        fontWeight: 'bold',
        fontSize: 22,
    },
    description: {
        fontSize: 15,
    },
    mainContainer: {
        flex: 0,
        flexWrap: 'wrap',
    }
});

export default ConflictingDataView;
