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
  Button
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
  }



  render() {
    const { vesselLists } = this.props;
    return(
      <View style={styles.container}>
        <TopHeader
          title="Vessel lists"  
        />
        <View style={styles.rowContainer}>
          <TextInput style={{flex: 5}}
            placeholder="Type list name and press Add"
            value={this.state.newListName}
            onChangeText={text => this.setState({newListName: text})}
          />
          <Button style={{flex: 2}}
            title="Add"
            disabled={this.state.newListName.length <= 0}
            onPress={() => this.props.createVesselList(this.state.newListName)}
          />


        </View>
        <List>
          {Object.keys(vesselLists).map(listName => {
            return (
              <ListItem
                key={listName}
                title={listName}
                onPress={() => this.setState({listDetailModalVisible: true, selectedList: listName})}
              />
            );
          })}
        </List>

        <Modal
          visible={this.state.listDetailModalVisible}
          onRequestClose={() => this.setState({listDetailModalVisible: false, selectedList: null})}
        >
          <MiniHeader
            navigation={this.props.navigation}
            title={`Vessels in ${this.state.selectedList}`}
            leftIconFunction={() => this.setState({listDetailModalVisible: false})}
          />
          <View style={styles.rowContainer}>
            <TextInput style={{flex: 5}}
              placeholder="Search by IMO number"
              value={this.state.newVesselImo}
              onChangeText={text => this.setState({newVesselImo: text})}
              keyboardType="numeric"
            />
            <Button style={{flex: 2}}
              title="Search"
              disabled={this.state.newVesselImo <= 0}
              onPress={() => this.props.fetchVessel("urn:mrn:stm:vessel:IMO:" + this.state.newVesselImo)}
            />
          </View>
          {!!this.props.foundVessel && 
            <TouchableWithoutFeedback
                onPress={() => this.props.addVesselToList(this.props.foundVessel, this.state.selectedList)}
            >
              <View>
                <Text>{this.props.foundVessel.name}</Text>
                <Text>{this.props.foundVessel.vesselType}</Text>
              </View>

            </TouchableWithoutFeedback>  
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
    flex: 1,
    flexDirection: 'row',
    maxHeight: 50,
    backgroundColor: colorScheme.primaryColor
  }
});

function mapStateToProps(state) {
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
  addVesselToList
})(VesselList);