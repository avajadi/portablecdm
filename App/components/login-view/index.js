import React, { Component } from 'react';
import { Constants, AuthSession } from 'expo';
import { connect } from 'react-redux';
import ModalDropdown from 'react-native-modal-dropdown';

import {
    View,
    Text,
    Image,
    StyleSheet,
    Picker,
    Dimensions,
    TouchableHighlight,
} from 'react-native';

import {
    FormInput,
    FormLabel,
    Icon,
} from 'react-native-elements';

import { 
    changeHostSetting
} from '../../actions';

import { APP_VERSION, STAGING } from '../../config/version';
import colorScheme from '../../config/colors';

import logo from '../../assets/login-view.png';
import riseLogo from '../../assets/riseLogo.png';
import euCoFinanceLogo from '../../assets/euCoFinance.png';
import stmLogo from '../../assets/stmLogo.jpg';

const dimensions = Dimensions.get('window');

class LoginView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            host: '',
            addHostVisible: false,
            addHostIconName: 'add-circle',
        };
    }

    componentDidMount() {
        console.log('PortableCDM started. Width: ' + 
            dimensions.width + 'px, height: ' + dimensions.height + 'px');
    }

    addHostPress() {
        if (this.state.addHostVisible) {
            this.props.changeHostSetting(this.state.host);
            this.setState({
                addHostVisible: false,
                addHostIconName: 'add-circle',
            })
        } 
        this.setState({
            addHostVisible: true,
            addHostIconName: 'done'
        });
    }

    renderHosts(hosts) {
        return hosts.map(host => <Picker.Item key={host} label={host} value={host} />);
    }

    render() {
        const { hosts, } = this.props;
        const { addHostVisible } = this.state;
        console.log('Hosts: ' + JSON.stringify(hosts));



        return (
            <View style={styles.mainContainer}>
                { false && 
                    <View style={{backgroundColor: 'red', marginTop: 30}}>
                        <Text style={{color: 'white', alignSelf: 'center'}}>DEV DEV DEV DEV DEV DEV DEV DEV DEV DEV</Text>
                    </View>
                }
                <View style={{backgroundColor: colorScheme.primaryColor}}>
                    <Image 
                        resizeMode="contain" 
                        style={styles.logo} 
                        source={logo} />
                </View>
                
                <View style={styles.contentContainer}>
                    <FormLabel>Host</FormLabel>
                    <View style={styles.hostContainer}>
                        {(hosts.length > 0 && !addHostVisible) &&
                        <ModalDropdown
                            style={styles.dropdownHost}
                            textStyle={styles.dropdownHostText}
                            options={hosts}
                            defaultValue={hosts[hosts.length - 1]}
                            onSelect={(index, value) => this.setState({host: value})}
                        />
                        }
                        {addHostVisible && 
                        <View>
                            <FormInput 
                                containerStyle={styles.hostTxtContainer}
                                onChangeText={text => this.setState({host: text})} 
                                autoCorrect={false}
                                placeholder={'example.com'}
                                autoCapitalize={false}
                                />
                        </View>
                        }
                        <Icon 
                        color={colorScheme.primaryColor}
                        name={this.state.addHostIconName}
                        size={35}
                        iconStyle={styles.btnAddHost}
                        onPress={() => this.addHostPress()}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    logo: {
        width: dimensions.width,
        //height: dimensions.width * 0.6669,
        height: dimensions.width * 0.8,
        backgroundColor: colorScheme.primaryColor,
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: colorScheme.primaryColor,
    },
    contentContainer: {
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'center',
        elevation: 50,
        backgroundColor: 'white',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowRadius: 3,
        shadowOpacity: 1.0,
    },
    hostContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        
    },
    btnAddHost: {
        marginRight: 0,
    }, 
    dropdownHost: {
        margin: 10,
    },
    dropdownHostText: {
        fontSize: 15,
    },
    hostTxtContainer: {
        width: dimensions.width / 2,
    }
  });
  

  function mapStateToProps(state) {
    return {
      connection: state.settings.connection,
      hosts: state.settings.hosts,
      error: state.error,
    }
  }

export default connect(mapStateToProps, {
    changeHostSetting,
    })(LoginView);
