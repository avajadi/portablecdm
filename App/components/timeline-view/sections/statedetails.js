import React, {Component} from 'react';
import { 
    View,
    StyleSheet,
    ScrollView,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';

import {
    Text,
    Button,
    List,
    ListItem,
    Divider,
    Icon,
    Avatar,
} from 'react-native-elements';
import colorScheme from '../../../config/colors';
import TopHeader from '../../top-header-view';


class StateDetails extends Component {
    static navigationOptions = {
        header: <TopHeader title = 'Details' />
    }

 
    render () {

        return(
        
        // 
        <View style= {styles.container} >
                {/* Vessel Name and Operation subtitle */}
                <View style={styles.headerContainer} >
                   {/* Vessel Name and avatar */}
                   <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text 
                            style={styles.headerTitleText}
                            > Vessel Name
                        </Text>
                    </View>
                    {/* Operation subtitle */}
                    <Text 
                        style={styles.headerSubText}
                        > Port Visit at Gothenburg
                    </Text>
                </View>


            {/* State List of this state */}
            <ScrollView>
                <List>
                    {/* State */}
                    <ListItem
                        containerStyle={styles.stateContainer}
                        hideChevron
                        title={
                            <View>
                                <Text style={styles.stateTitleText}>Arrival Vessel Traffic Area
                                </Text>     
                            <Divider style= {{backgroundColor: '#e1e8ee', height: 1, width: (Dimensions.get('screen').width/2)}} />
                            </View>
                        }

                        subtitle={
                            <View>
                                <Text style= {styles.stateSubTitleText} > 
                                    <Text>{`Time: 10.00 & Icon \n`}</Text>
                                    <Text>{`From: \n`}</Text>
                                    <Text>{`To: \n`}</Text>
                                    <Text>{`At: \n`}</Text>
                                    <Text>{`Reported By: \n`}</Text>
                                    <Text>{`Number of states: \n`}</Text> 
                                </Text>
                                
                            </View>
                        }
                    />
                    {/* Second state */}               
                    <ListItem
                        hideChevron
                        title='Arrival Vessel Traffic Area 2'
                        subtitle='Details'
                    />
                 

                    {/* TESTING state */}   
                    <ListItem
                        title='Testar API'
                        hideChevron
                    />

                    <ListItem
                        hideChevron
                        title='Logg med alla Messages'
                    />
                    <ListItem
                        hideChevron
                        title='Warnings!'
                    />

                </List>


                <Button
                    title='ButtonTitle'
                    onPress={() => this.props.navigation.navigate('DrawerOpen')}
                    
                />
            </ScrollView>
        </View>
        );
    }
}

export default StateDetails;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colorScheme.backgroundColor,
        flex: 1,
    },

    headerContainer: {
        backgroundColor: colorScheme.primaryColor,
        alignItems: 'center',
      //  flexDirection: 'column',
       
    },
    headerTitleText: {
       // fontWeight: 'bold',
        textAlign: 'center',
        color: colorScheme.primaryTextColor,
        fontSize: 20,
    },
    headerSubText: {
        textAlign: 'center',
        color: colorScheme.primaryTextColor,
        fontSize: 16,
    },
    stateContainer: {
        backgroundColor: colorScheme.primaryContainerColor,
    },
    stateTitleText: {
        fontWeight: 'bold',
        color: colorScheme.secondaryTextColor,
        fontSize: 14,
    },
    stateSubTitleText: {
       fontWeight: 'bold',
     
        color: colorScheme.secondaryTextColor,
        fontSize: 12,
    },
});



                // <Divider 
                //     style={{backgroundColor: 'blue'}}
                // />