import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    StyleSheet,
    Text,
    Modal,
} from 'react-native';
import { 
    Icon, 
    List, 
    ListItem, 
} from 'react-native-elements';

import MiniHeader from '../../mini-header-view';

import colorScheme from '../../../config/colors';


class WarningView extends Component {

    constructor(props) {
        super(props);

        this.getVessel = this.getVessel.bind(this);
    }

    formatWarningType(type) {
        return type.charAt(0) + type.substring(1).toLowerCase().replace(/_/g, ' ');
    }

    formatLocation(location) {
        return location.charAt(0).toUpperCase() + location.substring(1);
    }

    formatStateId(stateId) {
        return stateId.replace(/_/g, ' ');
    }

    getVessel(vesselId) {
        return this.props.portCalls.find(portCall => portCall.vesselId === vesselId).vessel;
    }

    renderDetails(warning) {
        switch(warning.warningType) {
            case 'MISSING_DATA':
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
                                            title={this.formatStateId(value)}
                                            titleStyle={styles.listItem}
                                            rightIcon = { <Icon
                                                color = {colorScheme.primaryColor}
                                                name='add-circle'
                                                size={35}
                                                onPress={() => {
                                                    this.props.addStatement(value, null);
                                                    this.props.onClose();
                                                }}
                                            />}
                                        />
                                    );
                                })
                            }
                        </List>
                    </View>
                )
            break;
            case 'MULTIPLE_VESSELS_AT_BERTH':
                const berth = this.formatLocation(warning.references.find(ref => ref.refType === 'LOCATION').refId.split('berth:')[1]);
                return (
                    <View>
                        <Text style={styles.header}>
                                {berth}
                        </Text>
                        <List>
                            {warning.references.filter(ref => ref.refType === 'VESSEL').map(ref => {
                                const vessel = this.getVessel(ref.refId);
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
            default:
            return null;
        }
    }

    render() {
        const { onClose, warning } = this.props;

        if (!warning) {
            return null;
        }

        const description = descriptions[warning.warningType] ? descriptions[warning.warningType] : 'Unkown warning.';

        return (
            <Modal
                visible={!!warning}
                onRequestClose={onClose}
                animationType='fade'
                transparent={false}
            >
                <MiniHeader 
                    modal 
                    hideRightIcon
                    title={'Warning'} 
                    leftIconFunction={onClose} 
                    leftIcons={{first: {name: 'warning', color: 'white'}}}
                    />
                <View style={styles.mainContainer}>
                    <View style={styles.centralizer}>
                        <Icon name="warning" color={colorScheme.warningColor} size={30} containerStyle={{marginTop: 10}} />
                        <Text style={styles.description}>{description}</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                        {this.renderDetails(warning)}
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 10,
    },
    detailsContainer: {
        padding: 5,
        borderRadius: 3,
    },
    description: {
        fontSize: 12,
        color: colorScheme.quaternaryTextColor, 
        margin: 10,
        textAlign: 'center',
    },
    header: {
        fontWeight: 'bold',
        fontSize: 22,
    },
    listItem: {
        color: colorScheme.quaternaryTextColor,
    },
    centralizer: {
        alignItems: 'center',
    },
});

const descriptions = {
    'MISSING_DATA': 'There are important data missing from the event. Tap a state to report a statement.',
    'MULTIPLE_VESSELS_AT_BERTH': 'There are multiple planned vessels at the same berth at the same time.',
}

function mapStateToProps(state) {
    return {
      portCalls: state.cache.portCalls,
    }
  }

export default connect(mapStateToProps)(WarningView);