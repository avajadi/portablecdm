import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  View,
  StyleSheet,
  TextInput,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';

import {  
  Text,
  List,
  ListItem,
  FormInput,
  Button,
  SearchBar
} from 'react-native-elements';

import TopHeader from '../top-header-view';
import MiniHeader from '../mini-header-view';
import colorScheme from '../../config/colors';
import { 
  createVesselList, 
  deleteVesselList, 
  addVesselToList, 
  removeVesselFromList, 
  fetchVessel,
  clearVesselResult
} from '../../actions';

class VesselList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newListName: '',
      newVesselImo: '',
      listDetailModalVisible: false,
      selectedList: null
    }

    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.props.clearVesselResult();
    this.setState({listDetailModalVisible: false})
  }


  render() {
    const { vesselLists } = this.props;
    return(
      <View style={styles.container}>
        <TopHeader
          title="Vessel lists"  
        />
        <View style={styles.rowContainer}>
          <SearchBar
            autoCorrent={false} 
            containerStyle = {styles.searchBarContainer}
            clearIcon
            inputStyle = {{backgroundColor: colorScheme.primaryContainerColor}}
            lightTheme  
            placeholder='Type list name and press Add'
            placeholderTextColor = {colorScheme.tertiaryTextColor}
            onChangeText={text => this.setState({newListName: text})}
            textInputRef='textInput'
          />
          <Button
            containerViewStyle={styles.buttonContainer}
            small
            title="Add"
            backgroundColor = {colorScheme.primaryColor} 
            disabled={this.state.newListName.length <= 0}
            disabledStyle={{
              backgroundColor: colorScheme.primaryColor
            }}
            color={this.state.newListName <= 0 ? colorScheme.tertiaryTextColor : colorScheme.primaryTextColor}
            onPress={() => this.props.createVesselList(this.state.newListName)}
            /> 
        </View>
        <List>
          {/* Render all vessel lists, together with the vessels in those lists */}
          {Object.keys(vesselLists).map(listName => {
            return (
              <ListItem
                key={listName}
                title={listName}
                rightIcon={{
                  name: 'delete',
                  color: 'red',
                }}
                onPressRightIcon={() => this.props.deleteVesselList(listName)}
                onPress={() => this.setState({listDetailModalVisible: true, selectedList: listName})}
              />
            );
          })}
        </List>

        <Modal
          visible={this.state.listDetailModalVisible}
          onRequestClose={this.closeModal}
        >
          <MiniHeader
            navigation={this.props.navigation}
            title={`Vessels`}
            leftIconFunction={this.closeModal}
          />
          <View style={styles.rowContainer}>
            <SearchBar
              autoCorrent={false} 
              containerStyle = {styles.searchBarContainer}
              clearIcon
              inputStyle = {{backgroundColor: colorScheme.primaryContainerColor}}
              lightTheme  
              placeholder='Search by IMO number'
              placeholderTextColor = {colorScheme.tertiaryTextColor}
              onChangeText={text => this.setState({newVesselImo: text})}
              keyboardType="numeric"
              textInputRef='textInput'
            />
            <Button
              containerViewStyle={styles.buttonContainer}
              small
              title="Search"
              disabled={this.state.newVesselImo <= 0}
              color={this.state.newVesselImo <= 0 ? colorScheme.tertiaryTextColor : colorScheme.primaryTextColor}
              disabledStyle={{
                backgroundColor: colorScheme.primaryColor
              }}
              backgroundColor = {colorScheme.primaryColor}
              onPress={() => this.props.fetchVessel("urn:mrn:stm:vessel:IMO:" + this.state.newVesselImo)}
            /> 
            
          </View>
          {!!this.props.foundVessel && 
            <View
                style={{alignSelf: 'center', flexDirection: 'row'}}
            >
              <View>
                <Text>Name: {this.props.foundVessel.name}</Text>
                <Text>Type: {this.props.foundVessel.vesselType}</Text>
                <Text>Call sign: {this.props.foundVessel.callSign}</Text>
              </View>
              <View
                style={{alignSelf: 'center'}}
              >
                <Button
                  title="Add to list"
                  onPress={() => this.props.addVesselToList(this.props.foundVessel, this.state.selectedList)}                
                />
              </View>

            </View>
          }
          {this.state.selectedList &&
            <View>
              <Text h4>Vessels in {this.state.selectedList}</Text>
              <List style={{borderTopWidth: 0, borderBottomWidth: 0}}>
                {vesselLists[this.state.selectedList].map((vessel, vesselIndex) => {
                  return(
                    <ListItem
                      key={vesselIndex}
                      title={vessel.name}
                      rightIcon={{
                        name: 'delete',
                        color: 'red',
                      }}
                      onPressRightIcon={() => this.props.removeVesselFromList(vessel, this.state.selectedList)}
                    />
                  );
                })}
              </List>
            </View>
          }

        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rowContainer: {
    flexDirection: 'row',
    backgroundColor: colorScheme.primaryColor,
    marginBottom: 5,
  },
  searchBarContainer: {
    backgroundColor: colorScheme.primaryColor,
    flex: 3,
    marginRight: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0,      
  },
  buttonContainer: {
    flex: 1,
    marginRight: 0,
    marginLeft: 0,
    alignSelf: 'center',
  },
});

function mapStateToProps(state) {
  console.log(state.settings.vesselLists)
  return {
    vesselLists: state.settings.vesselLists,
    foundVessel: state.vessel.vessel
  };
}

export default connect(mapStateToProps, {
  addVesselToList,
  createVesselList,
  deleteVesselList,
  removeVesselFromList,
  fetchVessel,
  addVesselToList,
  clearVesselResult
})(VesselList);