import React, { Component } from 'react';
import {
    Picker,
    Slider,
    Button,
    View,
    Text,
    StyleSheet,
    TextInput
} from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker';

import Filter from '../../model/filter';

export default class FilterMenu extends Component {

  constructor(props) {
    super(props);

    this.state = {
      incomingfilters: this.props.filters,
      showDateTimePicker: false,
      pickDateTimeFor: ''
    };
  }

  // These handle the DateTime picker
  _showDateTimePicker = (pickFor) => this.setState({showDateTimePicker: true, pickDateTimeFor: pickFor});
  _hideDateTimePicker = () => this.setState({showDateTimePicker: false, pickDateTimeFor: ''});
  _handleDateTimePicked = (date) => {
    this.setState({[this.state.pickDateTimeFor]: date, pickDateTimeFor: ''});
    this._hideDateTimePicker();
  }

  applyFilters = (functionToRun) => {
    const { after, before } = this.state;
    console.log('In applyFilters in filtermenu');
    let filters = new Filter();
    if(after) filters.after = after;
    if(before) filters.before = before;

    functionToRun(filters);
  };

  render() {
    const { after, before } = this.state;
    const { onApplyFilters } = this.props;
    
    return(
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <Text>Count: </Text>
                <TextInput
                    style={{width: 40}}
                    keyboardType='numeric'

                />
            </View>
            {/*<View style={styles.filterContainer}>
                <Text>Starting after: </Text>
                {after && <Text>{after.toLocaleString()}</Text>}
                <Button 
                    title="Pick time"
                    onPress={() => this._showDateTimePicker('after')}
                />
            </View>
            <View style={styles.filterContainer}>
                <Text>Starting before: </Text>
                {before && <Text>{before.toLocaleString()}</Text>}
                <Button 
                    title="Pick time"
                    onPress={() => this._showDateTimePicker('before')}
                />
            </View>
            <Button
                title="Ok"
                onPress={() => this.applyFilters(onApplyFilters)}
            />*/}
            <DateTimePicker
                isVisible={this.state.showDateTimePicker}
                onConfirm={this._handleDateTimePicked}
                onCancel= {this._hideDateTimePicker}
                mode='datetime'
            />
        </View> 
    );
  }

  
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filterContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center'
    }
});
