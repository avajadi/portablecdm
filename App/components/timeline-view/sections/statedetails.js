import React, {Component} from 'react';

import { connect } from 'react-redux';

import { 
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';

import {
    Text,
    Icon,
} from 'react-native-elements';

import Collapsible from 'react-native-collapsible';

import colorScheme from '../../../config/colors';
import TopHeader from '../../top-header-view';
import StatementView from './statementview';

import { withdrawStatement } from '../../../actions';
import { cleanURN } from '../../../util/stringUtils';


class StateDetails extends Component {
    constructor(props) {
        super(props);

        const {operation, statements} = (props.navigation ? props.navigation.state.params : props);
        this.state = {
            operation: operation,
            statements: statements
        }
        this.gotoReportPortCall = this.gotoReportPortCall.bind(this);
    }

    

    gotoReportPortCall = (operation, statements) => {
        this.props.navigation.navigate('SendPortCall', {
            stateId: statements[0].stateDefinition, 
            atLocation: operation.atLocation, 
            fromLocation: operation.fromLocation, 
            toLocation: operation.toLocation
        });
    }

    render () {
        const { operation, statements } = this.state;
        const { vessel, portCall, getStateDefinition, currentHost } = this.props;
        const stateDef = getStateDefinition(statements[0].stateDefinition);

        return(
            
        <View style= {styles.container} >
            <TopHeader title = 'Details' navigation={this.props.navigation} rightIconFunction={() => this.gotoReportPortCall(operation, statements)}/>
                {/* Vessel Name and Operation subtitle */}
                <View style={styles.headerContainer} >
                   {/* Vessel Name and avatar */}
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.headerTitleText}> {vessel.name} </Text>
                    </View>
                    {/* Operation subtitle */}
                        { operation.atLocation &&  <Text style={styles.headerSubText}> {operation.definitionId.replace(/_/g,' ')} at {operation.atLocation.name}</Text>}
                        { operation.fromLocation &&  <Text style={styles.headerSubText}> {operation.definitionId.replace(/_/g,' ')} from {operation.fromLocation.name}</Text>}
                        { operation.toLocation &&  <Text style={styles.headerSubText}> {operation.definitionId.replace(/_/g,' ')} to {operation.toLocation.name}</Text>}
                        
                </View>
            {/* State List of this state */}
            <ScrollView maximumZoomScale={10}>
                <ScrollView style={styles.container}>

                    {/*Warnings*/}
                    {statements.warnings &&
                        statements.warnings.map((warning, index) => {
                        return (
                            <View style={styles.warningContainer} key={index}>
                                <Icon name='warning' color={colorScheme.warningColor} size={24} paddingLeft={0}/>
                                <Text style={styles.warningText} >Warning: {warning.message}</Text>
                            </View>
                        );
                    })} 


                    {/*StatementView*/}
                    {statements.map( statement => {
                        return <StatementView key={statement.messageId} statement={statement} stateDef={stateDef} />
                    } )} 
                </ScrollView>
            </ScrollView>
        </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: colorScheme.backgroundColor,
        flex: 1,
    },
    headerContainer: {
        backgroundColor: colorScheme.primaryColor,
        alignItems: 'center',
    },
    headerTitleText: {
        textAlign: 'center',
        color: colorScheme.primaryTextColor,
        fontSize: 20,
    },
    headerSubText: {
        textAlign: 'center',
        color: colorScheme.secondaryContainerColor,
        fontSize: 12,
        paddingBottom: 10,
    },
    warningContainer: {
        backgroundColor: colorScheme.primaryContainerColor, 
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 0, 
        borderColor: colorScheme.warningColor,
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        alignItems: 'center',
       // justifyContent: 'center',
        paddingRight: 10,
    },
    warningText: {
        paddingLeft: 10, 
        color: colorScheme.quaternaryTextColor,
        fontSize: 12,
     //   paddingRight: 10,
    },
});

function mapStateToProps (state) {
    return {
        vessel: state.portCalls.vessel,
        portCall: state.portCalls.selectedPortCall,
        getStateDefinition: state.states.stateById,

    }
}

export default connect(mapStateToProps, {withdrawStatement})(StateDetails);