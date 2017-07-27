import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';

import {
  Text,
  Icon,
  List,
  ListItem,
  FormInput,
  FormLabel,
  Button
} from 'react-native-elements';

import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';

import { changeHostSetting, changePortSetting } from '../../actions';

class Settings extends Component {
  render() {
    const { navigate, state } = this.props.navigation;
    const { connection, changeHostSetting, changePortSetting } = this.props;

    return(
      <View style={styles.container}>
        <TopHeader title = 'Settings' firstPage navigation={this.props.navigation} rightIconFunction={this.goToStateList}/>
        <ScrollView style={styles.scrollContainer}>
            <Text h4>Connection:</Text>
            <FormLabel>Host: </FormLabel>
            <FormInput 
              value={connection.host} 
              onChangeText={(text) => changeHostSetting(text)}
            />

            <FormLabel>Port: </FormLabel>
            <FormInput 
              value={connection.port}
              onChangeText={(text) => changePortSetting(text)}
            />
          <Button
            backgroundColor={colorScheme.primaryColor}
            color={colorScheme.primaryTextColor}
            title="Manage favorite states"
            onPress={() => navigate('FavoriteStates')}
          />
          {/* <List>
            <ListItem
              title='Profile'    
              titleStyle={styles.titleStyle}
              badge={{
                value: '', 
                textStyle: styles.badgeText,
                containerStyle: {backgroundColor: colorScheme.primaryContainerColor},          
                wrapperStyle: {justifyContent: 'center'},
                }}
                //onPress={ () => {this.setModalStagesVisible.bind(this)(true)}}
            />
            <ListItem
              title='Change Actor'    
              titleStyle={styles.titleStyle}
              badge={{
                value: 'Port Authority', 
                textStyle: styles.badgeText,
                containerStyle: {backgroundColor: colorScheme.primaryContainerColor},          
                wrapperStyle: {justifyContent: 'center'},
                }}
                //onPress={ () => {this.setModalStagesVisible.bind(this)(true)}}
            />
          </List>
          <List>
            <ListItem
              title='App Language'    
              titleStyle={styles.titleStyle}
              badge={{
                value: 'English', 
                textStyle: styles.badgeText,
                containerStyle: {backgroundColor: colorScheme.primaryContainerColor},          
                wrapperStyle: {justifyContent: 'center'},
                }}
                //onPress={ () => {this.setModalStagesVisible.bind(this)(true)}}
            />
            <ListItem
              title='Region'    
              titleStyle={styles.titleStyle}
                //onPress={ () => {this.setModalStagesVisible.bind(this)(true)}}
            />
          </List>
          <List>
            
            <ListItem
              title='Push Notifications'    
              titleStyle={styles.titleStyle}
                //onPress={ () => {this.setModalStagesVisible.bind(this)(true)}}
            />
            <ListItem
              title='Sound'    
              titleStyle={styles.titleStyle}
                //onPress={ () => {this.setModalStagesVisible.bind(this)(true)}}
            />
          </List>
          <List>
            <ListItem
              title='About'    
              titleStyle={styles.titleStyle}
                //onPress={ () => {this.setModalStagesVisible.bind(this)(true)}}
            />
            <ListItem
              title='Updates'    
              titleStyle= {styles.titleStyle}
                //onPress={ () => {this.setModalStagesVisible.bind(this)(true)}}
            />
          </List> */}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme.backgroundColor,
  },
  scrollContainer: {
    backgroundColor: colorScheme.backgroundColor,
    paddingTop: 20,
  },
  titleStyle: {
    color: colorScheme.quaternaryTextColor,
  },
  badgeText: {
    color: colorScheme.secondaryColor,
  },
});

function mapStateToProps(state) {
  return {
    connection: state.settings.connection,
  };
}

export default connect(mapStateToProps, {changeHostSetting, changePortSetting})(Settings);