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

class MultipleActualsView extends Component {

    
    render() {
        const { operation, warning } = this.props;
        const statements = operation.statements.filter(statement => warning.references.some(ref => ref.refId === statement.messageId));
        return (
            <View style={styles.mainContainer}>
                <Text style={styles.header}>
                        Conflicting statements for {statements[0].stateDefinition.replace(/_/g, ' ')}
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
    mainContainer: {
        flex: 0,
        flexWrap: 'wrap',
    }
});

export default MultipleActualsView;
