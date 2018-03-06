import React, { Component } from 'react';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import {
    List,
    ListItem,
} from 'react-native-elements';

import StateView from '../stateview';
import colorScheme from '../../../../config/colors';

class MultipleActualsView extends Component {

    
    render() {
        const { operation, warning } = this.props;
        const statements = operation.statements.filter(statement => warning.references.some(ref => ref.refId === statement.messageId));
        return (
            <View>
            <Text style={styles.header}>
                States without data
            </Text>
            <List>
                {
                    warning.indicatorValues.filter(({value, type}) => type === 'STATE_ID').map(({value}, index) => {
                        return (
                            <ListItem
                                key={index}
                                title={formatStateId(value)}
                                titleStyle={styles.listItem}
                                rightIcon = { <Icon
                                    color = {colorScheme.primaryColor}
                                    name='add-circle'
                                    size={35}
                                    onPress={() => {
                                        addStatement(value, null);
                                        onClose();
                                    }}
                                />}
                            />
                        );
                    })
                }
            </List>
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

export default MultipleActualsView;
