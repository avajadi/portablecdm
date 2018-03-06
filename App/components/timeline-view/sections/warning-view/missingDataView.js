import React, { Component } from 'react';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import {
    List,
    ListItem,
    Icon,
} from 'react-native-elements';

import colorScheme from '../../../../config/colors';

class MultipleVesselsAtBerthView extends Component {

    
    render() {
        const { warning, addStatement, onClose, formatStateId, } = this.props;
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
        fontSize: 22,
    },
    listItem: {
        color: colorScheme.quaternaryTextColor,
    },
});

export default MultipleVesselsAtBerthView;
