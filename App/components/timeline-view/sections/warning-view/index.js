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

import MultipleActualsView from './multipleActualsView';
import MultipleVesselsAtBerthView from './multipleVesselsAtBerthView';
import MissingDataView from './missingDataView';
import MultipleLocationsView from './multipleLocationsView';
import MiniHeader from '../../../mini-header-view';
import StateDetails from '../statedetails';

import colorScheme from '../../../../config/colors';
import ConflictingDataView from './conflictingDataView';

const WARNING_TYPES = {
    MULTIPLE_VESSELS_AT_BERTH: 'MULTIPLE_VESSELS_AT_BERTH',
    MULTIPLE_ACTUALS: 'MULTIPLE_ACTUALS',
    CONFLICTING_DATA: 'CONFLICTING_DATA',
    MISSING_DATA: 'MISSING_DATA',
    VESSEL_AT_MULTIPLE_LOCATIONS: 'VESSEL_AT_MULTIPLE_LOCATIONS',
};


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
            case WARNING_TYPES.MISSING_DATA:
                return (
                    <MissingDataView warning={warning} addStatement={this.props.addStatement} onClose={this.props.onClose} formatStateId={this.formatStateId} />
                )
            case WARNING_TYPES.MULTIPLE_VESSELS_AT_BERTH:
                return (
                   <MultipleVesselsAtBerthView warning={warning} getVessel={this.getVessel} formatLocation={this.formatLocation} />
                );
            case WARNING_TYPES.MULTIPLE_ACTUALS:
                return <MultipleActualsView operation={this.props.operation} warning={warning} /> 
            case WARNING_TYPES.VESSEL_AT_MULTIPLE_LOCATIONS:
                return <MultipleLocationsView operation={this.props.operation} warning={warning} allLocations={this.props.allLocations} />
            case WARNING_TYPES.CONFLICTING_DATA:
                return <ConflictingDataView operation={this.props.operation} warning={warning} />
            default:
            return null;
        }
    }

    render() {
        const { onClose, warning, operation } = this.props;

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
    centralizer: {
        alignItems: 'center',
    },
});

const descriptions = {
    'MISSING_DATA': 'There are important data missing from the event. Tap a state to report a statement.',
    'MULTIPLE_VESSELS_AT_BERTH': 'There are multiple planned vessels at the same berth at the same time.',
    'MULTIPLE_ACTUALS': 'There exists differing timestamps with type ACTUAL.',
    'VESSEL_AT_MULTIPLE_LOCATIONS': 'The vessel is reported to be at multiple locations at the same time.',
    'CONFLICTING_DATA': 'There is a difference in time in the reported data.',
}

function mapStateToProps(state) {
    return {
      portCalls: state.cache.portCalls,
      allLocations: state.location.locations,
    }
  }

export default connect(mapStateToProps)(WarningView);