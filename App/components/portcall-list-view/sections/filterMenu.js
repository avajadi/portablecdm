import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    Modal,
    TouchableHighlight,
    Picker
} from 'react-native';
import {
    List,
    ListItem,
    Icon,
    Button,
    ButtonGroup,
    Badge,
    Slider,
    CheckBox,
} from 'react-native-elements';

import MiniHeader from '../../mini-header-view';

import {
    fetchPortCalls,
    filterChangeLimit,
    filterChangeSortBy,  
    filterChangeOrder,
    filterChangeVesselList,
    filterChangeArrivingWithin,
    filterChangeDepartingWithin,
    filterClearArrivingDepartureTime,
    filterChangeOnlyFuturePortCalls,
} from '../../../actions';

import colorScheme from '../../../config/colors';

class FilterMenu extends Component {

constructor(props){
    super(props)

    let timeFilterIndex = 2;
    if(props.filters.arrivingWithin === 0 && props.filters.departingWithin === 0) {
        timeFilterIndex = 2;
    } else if(props.filters.arrivingWithin > 0) {
        timeFilterIndex = 0;
    } else if(props.filters.departingWithin > 0) {
        timeFilterIndex = 1;
    }

    let withinValue = 0;
    if(timeFilterIndex === 0) {
        withinValue = props.filters.arrivingWithin;
    } else if(timeFilterIndex === 1) {
        withinValue = props.filters.departingWithin;
    }

    this.state = {
        selectedSortByIndex: props.filters.sort_by === 'ARRIVAL_DATE' ? 0 : 1,
        selectedOrderByIndex: props.filters.order === 'DESCENDING' ? 0 : 1,
        selectedTimeIndex: timeFilterIndex,
        modalStagesVisible: false,
        checked: false,
        limitFilter: props.filters.limit,
        vesselListFilter: props.filters.vesselList,
        withinValue: withinValue,
        onlyFetchActivePortCalls: props.filters.onlyFetchActivePortCalls,
    }

  this.onBackIconPressed = this.onBackIconPressed.bind(this);
  this.onDoneIconPressed = this.onDoneIconPressed.bind(this);
}
setModalStagesVisible(visible){
    this.setState({modalStagesVisible: visible});
}

onBackIconPressed() {
    this.props.navigation.goBack();
}

onDoneIconPressed() {
    const { 
        limitFilter, 
        selectedSortByIndex, 
        selectedOrderByIndex, 
        withinValue, 
        selectedTimeIndex,
        onlyFetchActivePortCalls
    } = this.state;
    const { 
        filters, 
        fetchPortCalls, 
        filterChangeLimit, 
        filterChangeSortBy, 
        filterChangeOrder,
        filterChangeVesselList,
        filterChangeArrivingWithin,
        filterChangeDepartingWithin,
        filterClearArrivingDepartureTime,
        filterChangeOnlyFuturePortCalls
    } = this.props;

    // Limit
    filterChangeLimit(limitFilter);

    // Sort By (ARRIVAL_DATE | LAST_UPDATE)
    if(selectedSortByIndex == 0) filterChangeSortBy('ARRIVAL_DATE');   
    if(selectedSortByIndex == 1) filterChangeSortBy('LAST_UPDATE');

    // Order
    if(selectedOrderByIndex === 0) filterChangeOrder('DESCENDING');
    if(selectedOrderByIndex === 1) filterChangeOrder('ASCENDING');

    // Arrival time/Departure time
    if(selectedTimeIndex === 2 || withinValue === 0) { // Don't filter in departure/arrival time
        filterClearArrivingDepartureTime();
    } else if(selectedTimeIndex === 1) { // departing from
        filterChangeDepartingWithin(withinValue);
    } else if(selectedTimeIndex === 0) { // arriving within
        filterChangeArrivingWithin(withinValue);
    } else {
        
    }
    
    // Filter for not showing old PortCalls
    filterChangeOnlyFuturePortCalls(onlyFetchActivePortCalls);

    // Vessel List
    filterChangeVesselList(this.state.vesselListFilter);

    fetchPortCalls();
    this.props.navigation.goBack();
}

render() {
const buttonsSortBy = ['Arrival Date', 'Last Update']
const buttonsOrderBy = ['Descending', 'Ascending']
const buttonsTime = ['Arrival Time', 'Departure Time', 'All']
const {selectedSortByIndex, selectedOrderByIndex, selectedTimeIndex} =this.state

    return(
        <View style={{flex: 1}}>
            <MiniHeader 
                navigation={this.props.navigation} title="Filter"
                leftIconFunction={this.onBackIconPressed}
                rightIconFunction={this.onDoneIconPressed}
            />
            <ScrollView style= {styles.container} >

                <View style={styles.smallContainer}> 
                    <Text style={styles.textTitle}> Sort by </Text>
                        <ButtonGroup
                            buttons={buttonsSortBy}
                            selectedIndex={selectedSortByIndex}
                            containerStyle={styles.buttonStyle}
                            textStyle={{color: colorScheme.quaternaryTextColor, textAlign: 'center'}}
                            underlayColor= {colorScheme.secondaryColor}
                            selectedTextStyle={{color: colorScheme.primaryTextColor}}
                            selectedBackgroundColor={colorScheme.primaryColor}
                            onPress={(index) => this.setState({selectedSortByIndex: index})}

                        />
                </View>

                <View style={styles.smallContainer}> 
                    <Text style={styles.textTitle}> Order by </Text>
                        <ButtonGroup
                            buttons={buttonsOrderBy}
                            selectedIndex={selectedOrderByIndex}
                            containerStyle={styles.buttonStyle}
                            textStyle={{color: colorScheme.quaternaryTextColor}}
                            underlayColor= {colorScheme.secondaryColor}
                            selectedTextStyle={{color: colorScheme.primaryTextColor}}
                            selectedBackgroundColor={colorScheme.primaryColor}
                            onPress={(index) => this.setState({selectedOrderByIndex: index})}
                        />
                </View>

                {/* Button group for arriving/departing within filter  */}
                <View style={styles.smallTimeContainer}> 
                    <Text style={styles.textTitle}> Time </Text>
                        <ButtonGroup
                            buttons={buttonsTime}
                            selectedIndex={selectedTimeIndex}
                            containerStyle={styles.buttonStyle}
                            textStyle={{color: colorScheme.quaternaryTextColor}}
                            underlayColor= {colorScheme.secondaryColor}
                            selectedTextStyle={{color: colorScheme.primaryTextColor}}
                            selectedBackgroundColor={colorScheme.primaryColor}
                            onPress={(index) => this.setState({selectedTimeIndex: index})}
                        />
                    <Slider
                        value={this.state.withinValue}
                        minimumValue={0}
                        maximumValue={72}
                        step={1}
                        onValueChange={(value) => this.setState({withinValue: value})}  
                        thumbTintColor={colorScheme.primaryColor}
                    />
                    <Text style={{fontWeight: 'bold', paddingLeft: 10,}}>Time Within: {this.state.withinValue} hours</Text>
                    <CheckBox
                        title="Don't display departed Port Calls"
                        iconRight
                        right
                        checked={this.state.onlyFetchActivePortCalls}
                        onPress={() => this.setState({onlyFetchActivePortCalls: !this.state.onlyFetchActivePortCalls})}
                    />
                </View>

                {/* Picker for Vessel List */}
                {false && (
                <View style={styles.smallContainer}>
                    <Text style={styles.textTitle}>Vessel list</Text>
                    <Picker style={{marginTop: 20, marginLeft: 10, marginRight: 10, borderRadius: 20,backgroundColor: colorScheme.primaryTextColor}}
                        selectedValue={this.state.vesselListFilter}
                        onValueChange={(itemValue, itemIndex) => this.setState({vesselListFilter: itemValue})}
                    >
                        <Picker.Item label="All vessels" value='all' />
                        {Object.keys(this.props.vesselLists).map(vesselListName => (
                            <Picker.Item key={vesselListName} label={vesselListName} value={vesselListName} />
                        ))}
                    </Picker>
                </View>)
                }

                {/*Limit View with title and slider*/}
                <View style={styles.smallTimeContainer}> 
                    <Text style={styles.textTitle}> Limit </Text>
                    {/* List first then sliding bar */}
                    <Slider
                        minimumValue={30}
                        /* maximumValue={this.props.maxPortLimitPortCalls}  TODO*/
                        maximumValue={300}
                        step={50}
                        value={this.state.limitFilter}
                        onValueChange={(value) => this.setState({limitFilter: value})}  
                        thumbTintColor={colorScheme.primaryColor}
                    />
                    <Text style={{fontWeight: 'bold', paddingLeft: 10,}}> Limit: {this.state.limitFilter} portcalls retrieved </Text>
                </View>
            
                {/*Button - SHOW RESULTS*/}
                <View style={{backgroundColor: colorScheme.primaryColor, marginTop: 10, paddingVertical: 5,}}>
                    <Button 
                        title="Show Results"
                        textStyle={{color: colorScheme.primaryTextColor}}
                        buttonStyle={{backgroundColor: colorScheme.primaryColor}}
                        onPress={this.onDoneIconPressed}
                    />
                </View>

            </ScrollView>
        </View>
    ); //Return
} //Render
}; //Class FilterMenu 

const styles = StyleSheet.create({
    container: {
        backgroundColor: colorScheme.backgroundColor,
        flex: 1,
    },
    textTitle: {
        textAlign: 'center',
        color: colorScheme.quaternaryTextColor,
        fontWeight: 'bold',
        paddingBottom: 10 ,
    },
    smallContainer: {
        backgroundColor: colorScheme.backgroundColor,
        flexDirection: 'column',
        paddingTop: 15,
       // paddingBottom: 15,
        alignItems: 'stretch',
    },
    smallTimeContainer: {
        backgroundColor: colorScheme.backgroundColor,
        flexDirection: 'column',
        paddingTop: 15,
        marginTop: 15,
        paddingBottom: 15,
       // paddingBottom: 15,
        alignItems: 'stretch',
        borderWidth: 1,
        borderColor: colorScheme.secondaryContainerColor,
        borderRadius: 10,
    },
    buttonContainer: {
        backgroundColor: colorScheme.backgroundColor,
        flexDirection: 'row',
        flex: 1,
         justifyContent: 'center',
    },
    // Bara för ButtonGroup
    buttonStyle: { 
       // borderRadius: 2,
        backgroundColor: colorScheme.primaryContainerColor,
        height: 50,
     //   paddingLeft: 50,
    },
    // MODAL
    modalContainerStyle: {
        backgroundColor: colorScheme.primaryContainerColor ,
        flex: 1,
    },
    modalHeaderStyle: {
        backgroundColor: colorScheme.primaryContainerColor,
        flexDirection:'row',
        marginTop: 27,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
    },
    modalHeaderTextStyle: {
        color: colorScheme.quaternaryTextColor,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        justifyContent: 'center',
    },
    modalSubContainer: {
        backgroundColor: colorScheme.backgroundColor,
        flex: 1,
        borderColor: colorScheme.secondaryContainerColor,
        borderTopWidth: 1,        
    },
}); //styles

function mapStateToProps(state) {
    return {
        maxPortLimitPortCalls: state.settings.maxPortCallsFetched,
        maxHoursTimeDifference: state.settings.maxHoursTimeDifference,
        filters: state.filters,
        vesselLists: state.settings.vesselLists,

    };
}

export default connect(mapStateToProps, {
    fetchPortCalls,
    filterChangeLimit,
    filterChangeSortBy,
    filterChangeOrder,
    filterChangeVesselList,
    filterChangeArrivingWithin,
    filterChangeDepartingWithin,
    filterClearArrivingDepartureTime,
    filterChangeOnlyFuturePortCalls,
})(FilterMenu);