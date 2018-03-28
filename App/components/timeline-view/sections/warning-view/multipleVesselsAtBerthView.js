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

import colorScheme from '../../../../config/colors';

class MultipleVesselsAtBerthView extends Component {

    
    render() {
        const { warning } = this.props;
        const berth = this.props.formatLocation(warning.references.find(ref => ref.refType === 'LOCATION').refId.split('berth:')[1]);
        return (
            <View>
                <Text style={styles.header}>
                        {berth}
                </Text>
                <List>
                    {warning.references.filter(ref => ref.refType === 'VESSEL').map(ref => {
                        const vessel = this.props.getVessel(ref.refId);
                        return (
                            <ListItem
                            roundAvatar
                            avatar={{uri: vessel.photoURL}}
                            key={ref.refId}
                            title={vessel.name}
                            titleStyle={styles.listItem}
                            hideChevron
                            />
                        );
                    })}
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
