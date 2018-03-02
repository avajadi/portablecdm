import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import colorScheme from '../../../config/colors';
import { removeStringReportedBy } from '../../../util/stringUtils';

const StatementDetails = (props) => {
    const { statement } = props;
    return (
        <View style={[styles.container]}>
            <Text>{removeStringReportedBy(statement.reportedBy)}</Text>
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
        flexDirection: 'row'
    }
});

