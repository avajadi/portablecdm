import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import colorsScheme from '../../../config/colors';
import {
    List,
    ListItem,

} from 'react-native-elements';



export default class FilterMenu extends Component {

static navigationOptions = {
    title: 'Filter',
}

render() {

    return(
        <ScrollView style= {styles.container} >

            <View> 
                <Text style={styles.textTitle}> Sort by </Text>
                {/* Buttons */}
            </View>


            <View> 
                <Text style={styles.textTitle}> Order by </Text>
                {/* Buttons */}
            </View>
          

            <View> 
                <Text > Time </Text>
                {/* List first then sliding bar */}
            </View>

            <View> 
                <Text > Listan </Text>
                {/* Listan 
                    Lägg till badges för grå invalda val.
                    Lägg till fler titles */}
                <List>
                    <ListItem
                        title='Status'    
                    />
                
                </List>
            </View>

        </ScrollView>
    ); //Return


} //Render
}; //Class FilterMenu


const styles = StyleSheet.create({
    container: {
        backgroundColor: colorsScheme.backgroundColor,
        flex: 1,
    },
    textTitle: {
        textAlign: 'center',
        color: colorsScheme.secondaryTextColor,
    },




}); //styles




