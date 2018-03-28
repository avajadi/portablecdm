import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import colorScheme from '../../../config/colors';
import { cleanURN } from '../../../util/stringUtils';
import { getDateTimeString } from '../../../util/timeservices';


const StatementDetails = (props) => {
    const { statement } = props;

    const actualIcon = (<View style={[styles.actualContainer]}>
        <Text style={styles.actualText}>A</Text>
    </View>);
    
    const estimateIcon = (<View style={[styles.estimateContainer]}>
                            <Text style={styles.estimateText}>E</Text>
                          </View>);
    
    return (
        <View style={[styles.container]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {statement.timeType === 'ACTUAL' ? actualIcon : estimateIcon}
                <Text style={styles.text}>{getDateTimeString(new Date(statement.time))}</Text>
            </View>
            <Text style={styles.text}>{cleanURN(statement.reportedBy)}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>        
                <Text style={styles.text}><Text style={{fontWeight: 'bold', fontSize: 11}}>at </Text>{getDateTimeString(new Date(statement.reportedAt))}</Text>
            </View>
        </View>
    );
};

StatementDetails.propTypes = {
    statement: PropTypes.object.isRequired
}

export default StatementDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 5,
    },
    text: {
        fontSize: 9,
        marginLeft: 5,
    },
    actualText: {
        color: colorScheme.primaryTextColor,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
    },
    actualContainer: {
        backgroundColor: colorScheme.actualColor,
        borderRadius: 9,
        width: 18,
        height: 18,
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
    },
    estimateText: {
        color: colorScheme.primaryTextColor,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
    },
    estimateContainer: {
        backgroundColor: colorScheme.estimateColor,
        borderRadius: 9,
        width: 18,
        height: 18,
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
    },  
});

