import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
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
} from 'react-native-elements';



export default class FilterMenu extends Component {

constructor(){
    super()
    this.state = {
        selectedIndex: 2
    }
    this.updateIndex = this.updateIndex.bind(this)
}

static navigationOptions = {
    title: 'Filter',
    headerRight: <Button 
                    title="Reset" 
                    backgroundColor={colorScheme.primaryColor}
                    />,
}

updateIndex (selectedIndex) {
    this.setState({selectedIndex})
}

render() {
const sortTextNames = ['Arrival Date', 'Last Update', 'Vessel Name']
const buttonstextnames = ['DECENDING', 'ASCENDING']
const {selectedIndex} =this.state


    return(
        <ScrollView style= {styles.container} >

            <View style={styles.smallContainer}> 
                <Text style={styles.textTitle}> Sort by </Text>
                    <ButtonGroup
                        buttons={sortTextNames}
                        selectedIndex={selectedIndex}
                        containerStyle={styles.buttonStyle}
                        textStyle={{color: 'black', textAlign: 'center'}}
                        underlayColor= {colorScheme.secondaryColor}
                        selectedTextStyle='red'
                        onPress={() => console.log('SortGruop was pressed')}
                    />
            </View>

            <View style={styles.smallContainer}> 
                <Text style={styles.textTitle}> Order by </Text>
                    <ButtonGroup
                        buttons={buttonstextnames}
                        selectedIndex={selectedIndex}
                        containerStyle={styles.buttonStyle}
                        textStyle={{color: 'black'}}
                        underlayColor= {colorScheme.secondaryColor}
                        selectedTextStyle='red'
                        onPress={() => console.log('BUTTONGROUP was pressed')}
                    />
            </View>
          




            <View> 
                <Text style={styles.textTitle}> Mixed </Text>
                {/* List first then sliding bar */}
                <List>
                    <ListItem
                        title='Time Type'    
                        //titleStyle= {color= 'black'}
                        badge={{
                            value: 'Arrival', 
                            textStyle: { color: colorScheme.tertiaryTextColor },
                            containerStyle: {backgroundColor: colorScheme.primaryContainerColor},
                            
                            }}
                    />
                </List>
                <Text style={styles.textTitle}> Time Within </Text>
                <Slider
                    value={this.state.value}
                    onValueChange={(value) => this.setState({value})}  
                    thumbTintColor={colorScheme.primaryColor}
                />
                <Text> Value: {this.state.value} </Text>
                
            </View>

            <View style={styles.smallContainer}> 
                {/* Listan 
                    Lägg till badges för grå invalda val.
                    Lägg till fler titles */}
                <List>
                    <ListItem
                        title='Stages'    
                        badge={{
                            value: 5, 
                            textStyle: { color: colorScheme.tertiaryTextColor },
                            containerStyle: {backgroundColor: colorScheme.primaryContainerColor},
                            
                            }}
                    />
                    <ListItem
                        title='Status'    
                        badge={{
                            value: 'OK', 
                            textStyle: { color: colorScheme.tertiaryTextColor },
                            containerStyle: {backgroundColor: colorScheme.primaryContainerColor},
                            
                            }}
                    />
                    <ListItem
                        title='Vessel Type'    
                        badge={{
                            value: 'Tanker, Cargo',
                            textStyle: { color: colorScheme.tertiaryTextColor },
                            containerStyle: {backgroundColor: colorScheme.primaryContainerColor},
                            
                            }}
                    />
                </List>
            </View>

                        <View> 
                <Text style={styles.textTitle}> Limit </Text>
                {/* List first then sliding bar */}
                <Slider
                    value={this.state.value}
                    onValueChange={(value) => this.setState({value})}  
                    thumbTintColor={colorScheme.primaryColor}
                />
                <Text> Value: {this.state.value} </Text>
            </View>

        </ScrollView>
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
        color: colorScheme.secondaryTextColor,
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
      //  height: 50,
     //   paddingLeft: 50,
    },






}); //styles