import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  View,
  StyleSheet,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from 'react-native';

import {  
  Text,
  List,
  ListItem,
  FormInput,
  Button,
  SearchBar,
  Divider,
} from 'react-native-elements';

import TopHeader from '../top-header-view';
import MiniHeader from '../mini-header-view';
import colorScheme from '../../config/colors';
import { 
  createVesselList, 
  deleteVesselList, 
  addVesselToList, 
  removeVesselFromList, 
  appendVesselToPortCall,
  clearVesselResult,
  filterChangeVesselList,
  fetchVesselByName,
  removeError,
} from '../../actions';

class VesselList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newListName: '',
      newVessel: '',
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
          title="Vessel Lists"  
          navigation = {this.props.navigation}
        />
        <View style={styles.rowContainer}>
          <SearchBar
            autoCorrect={false} 
            containerStyle = {styles.searchBarContainer}
            noIcon
            inputStyle = {{backgroundColor: colorScheme.primaryContainerColor, fontSize: 15}}
            lightTheme  
            placeholder='Enter a name for a list'
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
                onPressRightIcon={() => {
                  if(this.props.chosenVesselListForFiltering === listName) {
                    this.props.filterChangeVesselList('all')
                  }
                  this.props.deleteVesselList(listName)}
                }
                onPress={() => this.setState({listDetailModalVisible: true, selectedList: listName})}
              />
            );
          })}
        </List>

        {/* Modal to display information about the chosen list, and add vessels to it */}
        <Modal
          visible={this.state.listDetailModalVisible}
          onRequestClose={this.closeModal}
        >
          <View style={styles.modalContainer}>
          <MiniHeader
            modal
            navigation={this.props.navigation}
            title={`Vessels`}
            leftIconFunction={this.closeModal}
            hideRightIcon
          />
          <View style={styles.rowContainer}>
            <SearchBar
              autoCorrect={false} 
              containerStyle = {styles.searchBarContainer}
              clearIcon
              inputStyle = {{backgroundColor: colorScheme.primaryContainerColor}}
              lightTheme  
              placeholder='Search by name or IMO number'
              placeholderTextColor = {colorScheme.tertiaryTextColor}
              onChangeText={text => this.setState({newVessel: text})}
              textInputRef='textInput'
            />
            <Button
              containerViewStyle={styles.buttonContainer}
              small
              title="Search"
              disabled={this.state.newVessel <= 0}
              color={this.state.newVessel <= 0 ? colorScheme.tertiaryTextColor : colorScheme.primaryTextColor}
              disabledStyle={{
                backgroundColor: colorScheme.primaryColor
              }}
              backgroundColor = {colorScheme.primaryColor}
              onPress={() => {
                    const { error, fetchVessel, fetchVesselByName } = this.props;
                    //Search by either name or IMO
                    if(isNaN(this.state.newVessel))
                        fetchVesselByName(this.state.newVessel).then(() => {
                            if(this.props.error.hasError) {
                                Alert.alert(
                                    this.props.error.error.title,
                                    this.props.error.error.description,
                                )
                                this.props.removeError(this.props.error.error.title);
                            }
                        });
                    else
                        fetchVessel('urn:mrn:stm:vessel:IMO:' + this.state.newVessel).then(() => {
                            if(this.props.error.hasError) {
                                Alert.alert(
                                    this.props.error.error.title,
                                    this.props.error.error.description,
                                )
                            }
                            this.props.removeError(this.props.error.error.title);
                        });
              }
            }
            /> 
            
          </View>
          {!!this.props.foundVessel && 
            <View
                style={styles.addToListContainer}
            >
              <View>
                <Text>IMO: {this.props.foundVessel.imo.split('IMO:')[1]}</Text>
                <Text>Name: {this.props.foundVessel.name}</Text>
                <Text>Type: {this.props.foundVessel.vesselType}</Text>
                <Text>Call sign: {this.props.foundVessel.callSign}</Text>
              </View>
              <View
                style={{alignSelf: 'center'}}
              >
                <Button
                  title="Add to List"
                  textStyle={{color: colorScheme.primaryTextColor, fontSize: 9}}
                  buttonStyle={styles.buttonStyle}
                  onPress={() => this.props.addVesselToList(this.props.foundVessel, this.state.selectedList)}                
                />
              </View>

            </View>
          }
          {this.state.selectedList &&
            <ScrollView style={styles.vesselListStyle}>
              <Text style={styles.titleText}>Vessels in {this.state.selectedList}</Text>
              <Divider style={{backgroundColor: colorScheme.tertiaryTextColor}}/>
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
            </ScrollView>
          }
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme.backgroundColor ,
  },
  modalContainer: {
    backgroundColor: colorScheme.backgroundColor,
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    backgroundColor: colorScheme.primaryColor,
  //  marginBottom: 5,
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
  addToListContainer: {
    backgroundColor: colorScheme.primaryContainerColor,
    alignSelf: 'center', 
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    marginLeft: 10,
    marginRight: 10,
    borderColor: colorScheme.tertiaryTextColor, 
    borderWidth: 1,
    borderRadius: 5, 
  },
  vesselListStyle: {
    backgroundColor: colorScheme.primaryContainerColor,
    marginTop: 10,
    marginBottom: 10,
    flex: 1,
    paddingBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    borderColor: colorScheme.tertiaryTextColor, 
    borderWidth: 1,
    borderRadius: 5, 
  },
  buttonStyle: {
    backgroundColor: colorScheme.primaryColor,
    borderColor: colorScheme.primaryColor, 
    borderWidth: 1,
    borderRadius: 5, 
  },
  titleText: {
    color: colorScheme.quaternaryTextColor,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 20,

  },
});

function mapStateToProps(state) {
  //console.log(state.settings.vesselLists)
  return {
    vesselLists: state.settings.vesselLists,
    foundVessel: state.vessel.vessel,
    chosenVesselListForFiltering: state.filters.vesselList,
    error: state.error,
  };
}

export default connect(mapStateToProps, {
  addVesselToList,
  createVesselList,
  deleteVesselList,
  removeVesselFromList,
  appendVesselToPortCall,
  fetchVesselByName,
  addVesselToList,
  clearVesselResult,
  filterChangeVesselList,
  removeError,
})(VesselList);