import React, { Component } from 'react';
import {
    Picker,
    Slider,
    Button,
    View,
    Text,
    StyleSheet
} from 'react-native';

export default class FilterMenu extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ... this.props.filters
    };
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.filterContainer}>
            <Text>Arriving after: </Text>
            <Button title="Pick" onPress={() => console.log("Arriving after clicked")} />
        </View>
        <View style={styles.filterContainer}>
            <Text>Arriving before: </Text>
            <Button title="Pick" onPress={() => console.log("Arriving before clicked")} />
        </View>
        <View style={styles.filterContainer}>
            <Text>Updated after: </Text>
            <Button title="Pick" onPress={() => console.log("Updated after clicked")} />
        </View>
        <View style={styles.filterContainer}>
            <Text>Updated after: </Text>
            <Button title="Pick" onPress={() => console.log("Updated before clicked")} />
        </View>
        <View style={styles.filterContainer}>
            <Text>Status: </Text>
            <Picker
                style={{width: 150}}
                selectedValue='ALL'
                onValueChange={(itemValue, itemIndex) => this.setState({timeType: itemValue})}>
                <Picker.Item label='All' value='ALL' />
                <Picker.Item label='Ok' value='OK' />
                <Picker.Item label='Warning' value='WARNING' />
                <Picker.Item label='Critical' value='CRITICAL' />
            </Picker>  
        </View>
        <View style={{flex: 1}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
                <Text>Limit number of Port calls returned: </Text>
                <Text>{this.state.countLimit}</Text>                       
            </View>
            <Slider
                minimumValue={0}
                maximumValue={1000}
                onValueChange={val => this.setState({countLimit: val})}
                step={1}
                value={300}
            />
        </View>
        <View style={styles.filterContainer}>
            <Text>Sort by:</Text>
            <Picker
                style={{width: 150}}
                selectedValue='ARRIVAL_DATE'
                onValueChange={(itemValue, itemIndex) => this.setState({timeType: itemValue})}>
                <Picker.Item label='Arrival Date' value='ARRIVAL_DATE' />
                <Picker.Item label='Last Updated' value='LAST_UPDATE' />
            </Picker>  
        </View>
        <View style={styles.filterContainer}>
            <Text>Order by:</Text>
            <Picker
                style={{width: 150}}
                selectedValue='ASCENDING'
                onValueChange={(itemValue, itemIndex) => this.setState({timeType: itemValue})}>
                <Picker.Item label='Ascending' value='ASCENDING' />
                <Picker.Item label='Descending' value='DESCENDING' />
            </Picker>  
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
            <Button title='Save as standard' onPress={this.saveFilters} />
            <Button title='Ok' onPress={this.applyFilters} style={{width: 200}} />
        </View>

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
