import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
    Alert,
} from 'react-native';

import {
    Text,
    Icon,
    List,
    ListItem,
    FormInput,
    FormLabel,
    Button,
    CheckBox,
    Slider,
} from 'react-native-elements';

import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';
import styles from '../../config/styles';

import {
    changeHostSetting,
    changePortSetting,
    changePortUnlocode,
    changeFetchReliability,
    clearCache,
    changeCacheLimit,
} from '../../actions';

class Settings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fetchReliability: props.fetchReliability,
            limitCache: props.limitCache,
        }

        this.updateFetchReliability = this.updateFetchReliability.bind(this);
    }

    updateFetchReliability() {
        this.props.changeFetchReliability(!this.state.fetchReliability);
        this.setState({ fetchReliability: !this.state.fetchReliability });
    }

    render() {
        const { navigate, state } = this.props.navigation;
        const { connection, changeHostSetting, changePortSetting, changePortUnlocode } = this.props;

        return (
            <View style={locStyles.container}>
                <TopHeader title='Settings' firstPage navigation={this.props.navigation} />
                <ScrollView style={locStyles.scrollContainer}>
                    <Button
                        backgroundColor={colorScheme.primaryColor}
                        color={colorScheme.primaryTextColor}
                        title="Edit Favorite States"
                        buttonStyle={locStyles.buttonStyle}
                        onPress={() => navigate('FavoriteStateSetting')}
                    />
                    <Button
                        backgroundColor={colorScheme.primaryColor}
                        color={colorScheme.primaryTextColor}
                        title="Clear cache"
                        buttonStyle={locStyles.buttonStyle}
                        onPress={() => {
                            Alert.alert(
                                'Confirmation',
                                'This will clear all cache and filters. Are you sure?',
                                [
                                    { text: 'No' },
                                    { text: 'Yes', onPress: () => this.props.clearCache() }
                                ]
                            );
                        }}
                    />
                    {false && <Button
                        backgroundColor={colorScheme.primaryColor}
                        color={colorScheme.primaryTextColor}
                        title="Edit Vessel Lists"
                        buttonStyle={locStyles.buttonStyle}
                        onPress={() => navigate('VesselLists')}
                    />}
                    <View style={styles.containers.info}>
                        <Slider
                            style={locStyles.sliderStyle}
                            minimumValue={0}
                            maximumValue={1000}
                            step={50}
                            value={this.state.limitCache}
                            onValueChange={value => {
                                this.props.changeCacheLimit(value);
                                this.setState({limitCache: value});
                            }}
                            thumbTintColor={colorScheme.primaryColor}
                            />
                            <Text style={{alignSelf: 'center'}}>
                                Maximum background port call cache: {this.state.limitCache}
                            </Text>
                    </View>
                    <CheckBox
                        title='Fetch reliabilities'
                        checked={this.state.fetchReliability}
                        onPress={this.updateFetchReliability}
                    />
                    <View style={styles.containers.info}>
                        <Text style={styles.texts.headerText} h3>
                            PortCDM connection information
                        </Text>
                        <Text style={styles.texts.infoText}>
                            <Text style={{ fontWeight: 'bold' }}>
                                UN/LOCODE:
                        </Text>
                            <Text style={{ fontWeight: 'normal' }}>
                                {' ' + connection.unlocode}
                            </Text>
                        </Text>
                        <Text style={styles.texts.infoText}>
                            <Text style={{ fontWeight: 'bold' }}>
                                Host:
                            </Text>
                            <Text style={{ fontWeight: 'normal' }}>
                                {' ' + connection.host}
                            </Text>
                        </Text>
                        <Text style={styles.texts.infoText}>
                            <Text style={{ fontWeight: 'bold' }}>
                                Port:
                            </Text>
                            <Text style={{ fontWeight: 'normal' }}>
                                {' ' + connection.port}
                            </Text>
                        </Text>
                        <Text style={styles.texts.infoText}>
                            <Text style={{ fontWeight: 'bold' }}>
                                User:
                            </Text>
                            <Text style={{ fontWeight: 'normal' }}>
                                {' ' + (!!connection.username ? connection.username : 'SeaSWIM user')}
                            </Text>
                        </Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const locStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorScheme.backgroundColor,
    },
    scrollContainer: {
        backgroundColor: colorScheme.backgroundColor,
        //   paddingTop: 20,
    },
    formContainerStyle: {
        backgroundColor: colorScheme.primaryContainerColor,
        margin: 10,
        paddingBottom: 10,
        paddingTop: 10,
        borderColor: colorScheme.tertiaryTextColor,
        borderWidth: 1,
        borderRadius: 5,
    },
    buttonStyle: {
        //backgroundColor: colorScheme.primaryColor,
        marginBottom: 10,
        marginTop: 10,
        borderColor: colorScheme.primaryColor,
        borderWidth: 1,
        borderRadius: 5,
    },
    titleStyle: {
        color: colorScheme.quaternaryTextColor,
        fontSize: 16,
        fontWeight: 'bold',
        paddingLeft: 10,
    },
    badgeText: {
        color: colorScheme.secondaryColor,
    },
    sliderStyle: {
        marginLeft: 20,
        marginRight: 20,
    }
});

function mapStateToProps(state) {
    return {
        fetchReliability: state.settings.fetchReliability,
        connection: state.settings.connection,
        limitCache: state.cache.limit,
    };
}

export default connect(mapStateToProps, {
    changeHostSetting,
    changePortSetting,
    changePortUnlocode,
    changeFetchReliability,
    clearCache,
    changeCacheLimit,
})(Settings);