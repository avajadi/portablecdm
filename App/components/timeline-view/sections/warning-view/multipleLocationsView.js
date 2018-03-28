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

class MultipleLocationsView extends Component {

    constructor(props) {
        super(props);

        this.getSweetLocationName = this.getSweetExpensiveLocationName.bind(this);
    }

    getSweetExpensiveLocationName(urn) {
        return this.props.allLocations.find(location => location.URN.toLowerCase() === urn.toLowerCase()).name;
    }

    render() {
        const { operation, warning } = this.props;

        const location = operation.fromLocation || operation.toLocation || operation.atLocation;

        return (
            <View>
                <Text style={styles.header}>
                    Locations reported
                </Text>
                <List>
                    <ListItem
                        title={location.name}
                        titleStyle={styles.listItem}
                        hideChevron
                    />
                    {
                        warning.references.filter(({refId, refType}) => refType === 'LOCATION').map(({refId}, index) => {
                            return (
                                <ListItem
                                    key={index}
                                    title={this.getSweetExpensiveLocationName(refId)}
                                    titleStyle={styles.listItem}
                                    hideChevron
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

export default MultipleLocationsView;
