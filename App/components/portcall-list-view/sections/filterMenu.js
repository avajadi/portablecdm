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
} from 'react-native';
import colorScheme from '../../../config/colors';
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

class FilterMenu extends Component {

constructor(){
    super()
    this.state = {
        selectedSortByIndex: 0,
        selectedOrderByIndex: 0,
        selectedTimeIndex: 0,
      //  modalVisible: false,
        modalStagesVisible: false,
        checked: false,
        limitValue: 0,
    }
  //  this.updateIndex = this.updateIndex.bind(this)
  this.onBackIconPressed = this.onBackIconPressed.bind(this);
  this.onDoneIconPressed = this.onDoneIconPressed.bind(this);
}

static navigationOptions = {
    title: 'Filter',
    headerRight: <Button 
                    title="Reset" 
                    backgroundColor={colorScheme.primaryColor}
                    />,
   // headerMode: 'float',
}

setModalStagesVisible(visible){
    this.setState({modalStagesVisible: visible});
}

onBackIconPressed() {
    this.props.navigation.goBack();
}

onDoneIconPressed() {
    console.log("pressed ok filter menu");
}

render() {
const buttonsSortBy = ['Arrival Date', 'Last Update', 'Vessel Name']
const buttonsOrderBy = ['Decending', 'Ascending']
const buttonsTime = ['Arrival Time', 'Departure Time']
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
                        value={this.state.value}
                        onValueChange={(value) => this.setState({value})}  
                        thumbTintColor={colorScheme.primaryColor}
                    />
                    <Text style={{fontWeight: 'bold', paddingLeft: 10,}}>Time Within: {this.state.value} </Text>
                </View>

                {/*MODAL BIG VIEW #1*/}
                <View style={styles.smallContainer}> 

                {/*Testing Modal                       TESTING TESTING                TESTING MODAL #1*/}
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalStagesVisible}
                >
                    {/*Modal View*/}
                    <View style={styles.modalContainerStyle}>
                        
                        {/*Modal Header with close, title and reset button*/}
                        <View style={styles.modalHeaderStyle}> 
                            <Icon 
                                name= "close"
                                onPress={() => {
                                this.setModalStagesVisible.bind(this)(!this.state.modalStagesVisible)
                                }}>
                            </Icon>
                        <Text style={styles.modalHeaderTextStyle}>Stages</Text> 
                        <Text style={{color: colorScheme.primaryColor}}> Reset </Text> 
                        </View>
                        
                        {/*Modal Sub Container with filter options*/}
                        <View style={styles.modalSubContainer}>
                            <View>
                                <List>
                                    <ListItem
                                        title='Planned'    
                                        titleStyle= {{color: colorScheme.quaternaryTextColor}}
                                        onPress={ () => console.log('List item pressed at MODAL 1')}
                                        hideChevron
                                    />
                                    <ListItem
                                        title='Arrived'    
                                        titleStyle= {{color: colorScheme.quaternaryTextColor}}
                                        onPress={ () => console.log('List item pressed')}
                                        hideChevron
                                    />
                                    <ListItem
                                        title='To Be Nominated'    
                                        titleStyle= {{color: colorScheme.quaternaryTextColor}}
                                        onPress={ () => console.log('List item pressed')}
                                        hideChevron
                                    />
                                    <ListItem
                                        title='Anchored'    
                                        titleStyle= {{color: colorScheme.quaternaryTextColor}}
                                        onPress={ () => console.log('List item pressed')}
                                        hideChevron
                                    />
                                    <ListItem
                                        title='Berthed'    
                                        titleStyle= {{color: colorScheme.tertiaryColor}}
                                        onPress={ () => console.log('List item pressed')}
                                        rightIcon={
                                            <Icon
                                                name='check'
                                                color={colorScheme.tertiaryColor}
                                                containerStyle={{paddingRight: 10}}/>}
                                    />
                                    <ListItem
                                        title='Departed'    
                                        titleStyle= {{color: colorScheme.tertiaryColor}}
                                        onPress={ () => console.log('List item pressed')}
                                        rightIcon={
                                            <Icon
                                                name='check'
                                                color={colorScheme.tertiaryColor}
                                                containerStyle={{paddingRight: 10}}/>}
                                    />
                                    <ListItem
                                        title='Sailed'    
                                        titleStyle= {{color: colorScheme.tertiaryColor}}
                                        onPress={ () => console.log('List item pressed')}
                                        rightIcon={
                                            <Icon
                                                name='check'
                                                color={colorScheme.tertiaryColor}
                                                containerStyle={{paddingRight: 10}}/>}
                                    />
                                </List>
                            </View>
                        </View>
                    </View>
                </Modal>
                </View> 
                {/*Slut på MODAL  BIG VIEW #1*/}

                <View style={styles.smallContainer}> 
                    <Text style={styles.textTitle}> Mixed filters </Text>
                    <List>
                        <ListItem
                            title='Stages'    
                            titleStyle= {{color: colorScheme.quaternaryTextColor}}
                            badge={{
                                value: 'Berthed, Departed, Sailed', 
                                textStyle: { color: colorScheme.secondaryColor },
                                containerStyle: {backgroundColor: colorScheme.primaryContainerColor},          
                                }}
                            onPress={ () => {this.setModalStagesVisible.bind(this)(true)}}
                        />
                        <ListItem
                            title='Status'    
                            titleStyle= {{color: colorScheme.quaternaryTextColor}}
                            badge={{
                                value: 'OK', 
                                textStyle: { color: colorScheme.secondaryColor },
                                containerStyle: {backgroundColor: colorScheme.primaryContainerColor},      
                                }}
                        />
                        <ListItem
                            title='Vessel Type'    
                            titleStyle= {{color: colorScheme.quaternaryTextColor}}
                            badge={{
                                value: 'Tanker Oil, Cargo',
                                textStyle: { color: colorScheme.secondaryColor },
                                containerStyle: {backgroundColor: colorScheme.primaryContainerColor},
                                }}
                        />
                    </List>
                </View>

                {/*Limit View with title and slider*/}
                <View style={styles.smallTimeContainer}> 
                    <Text style={styles.textTitle}> Limit </Text>
                    {/* List first then sliding bar */}
                    <Slider
                        minimumValue={29}
                        maximumValue={this.props.maxPortLimitPortCalls}
                        step={10}
                        value={this.state.limitValue}
                        onValueChange={(value) => this.setState({limitValue: value})}  
                        thumbTintColor={colorScheme.primaryColor}
                    />
                    <Text style={{fontWeight: 'bold', paddingLeft: 10,}}> Limit: {this.state.limitValue} portcalls retrieved </Text>
                </View>
            
                {/*Button - SHOW RESULTS*/}
                <View style={{backgroundColor: colorScheme.primaryColor, marginTop: 10, paddingVertical: 5,}}>
                    <Button 
                        title="Show Results"
                        textStyle={{color: colorScheme.primaryTextColor}}
                        buttonStyle={{backgroundColor: colorScheme.primaryColor}}
                        onPress={ () => console.log('Show Results button were pressed')}
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
    };
}

export default connect(mapStateToProps, {})(FilterMenu);