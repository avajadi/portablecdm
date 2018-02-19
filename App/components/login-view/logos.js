import React, { Component } from 'react';

import {
    StyleSheet,
    Image,
    View,
} from 'react-native';

import riseLogo from '../../assets/riseLogo.png';
import euCoFinanceLogo from '../../assets/euCoFinance.png';
import stmLogo from '../../assets/stmLogo.jpg';

class Logos extends Component {
    render() {
        return(
            <View style={styles.mainContainer}>
                <Image source={euCoFinanceLogo} style={styles.euCoFinance} />
                <Image source={riseLogo} style={styles.rise} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
    rise: {
        margin: 20 * 0.5,
        width: 75 * 0.5,
        height: 75 * 0.5,
    },
    euCoFinance: {
        width: 358 * 0.7,
        height: 50 * 0.7,
        marginTop: 10,
    },
    stm: {
        margin: 20,
        width: 138,
        height: 75,
    },
});


export default Logos;