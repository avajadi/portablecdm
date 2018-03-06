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

import StateView from '../stateview';
import colorScheme from '../../../../config/colors';

class MultipleLocationsView extends Component {

    
    render() {
        const { operation, warning } = this.props;
        const statements = operation.statements.filter(statement => warning.references.some(ref => ref.refId === statement.messageId));
        return (
            <View>
                <Text style={styles.header}>
                        Conflicting statements for {statements[0].stateDefinition.replace(/_/g, ' ')}
                </Text>
                <ScrollView>
                    {statements.map(statement => <StateView key={statement.messageId} operation={operation} statement={statement} stateDef={statement.stateDefinition} />)}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default MultipleLocationsView;
