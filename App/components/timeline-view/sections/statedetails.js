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
        const {params} = this.props.navigation.state;


        return(
            
        <View style= {styles.container} >
                {/* Vessel Name and Operation subtitle */}
                <View style={styles.headerContainer} >
                   {/* Vessel Name and avatar */}
                   <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.headerTitleText}> vesselName </Text>
                    </View>
                    {/* Operation subtitle */}
                    <Text style={styles.headerSubText}> Port Visit at Gothenburg </Text>
                </View>

            {/* State List of this state */}
            <ScrollView style={styles.container}>

                {/*StateView*/}
                <View style={styles.stateContainer}> 
                    {/*TitleView*/}
                    <View style={styles.titleContainer}> 
                        <Text style={styles.stateTitleText}>ARRIVAL VESSEL TRAFFIC AREA</Text>  
                    </View>
                    <Divider style={{backgroundColor: colorScheme.actualColor}}/>   
                    {/*tertiaryTextColor*/}
                    {/*DetailView*/}
                    <View style={styles.detailContainer}>
                        <View style={styles.timeView}> 
                            <Text style={styles.stateSubTitleText}>Time: </Text> 
                            <Text style={styles.detailText}>20.00   </Text>
                            <View style={styles.actualContainer}>
                                <Text style={styles.actualText}>A</Text>
                            </View>  
                        </View>
                        <Text style={styles.stateSubTitleText}>At:</Text>   
                        <Text style={styles.stateSubTitleText}>Reported By:</Text>  
                        <Text style={styles.stateSubTitleTextDisabled}>From:</Text>
                        <Text style={styles.stateSubTitleTextDisabled}>To:</Text>
                                 
                        <Text style={styles.stateSubTitleTextDisabled}>Reliability: %</Text>
                        <Text style={styles.stateSubTitleTextDisabled}>Warnings:</Text>  
                    </View>     
                </View>



{/*StateView*/}
                <View style={styles.stateContainer}> 
                    {/*TitleView*/}
                    <View style={styles.titleContainer}> 
                        <Text style={styles.stateTitleText}>DEPARTURE VESSEL TRAFFIC AREA</Text>  
                    </View>
                    <Divider style={{backgroundColor: colorScheme.estimateColor}}/>
                    {/*DetailView*/}
                    <View style={styles.detailContainer}>
                        <View style={styles.timeView}> 
                            <Text style={styles.stateSubTitleText}>Time: </Text> 
                            <Text style={styles.detailText}>20.00   </Text>
                            <View style={styles.estimateContainer}>
                                <Text style={styles.estimateText}>E</Text>
                            </View>
                        </View>
                        <Text style={styles.stateSubTitleText}>At:</Text> 
                        <Text style={styles.stateSubTitleText}>Reported By:</Text>   
                        <Text style={styles.stateSubTitleText}>From:</Text>
                        <Text style={styles.stateSubTitleText}>To:</Text>
                                  
                        <Text style={styles.stateSubTitleText}>Reliability:</Text>
                        <Text style={styles.stateSubTitleText}>Warnings:</Text> 
                    </View>     
                </View>







                <Button
                    title='See more'
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
    },
    headerTitleText: {
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
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
    },
    stateTitleText: {
        fontWeight: 'bold',
        color: colorScheme.quaternaryTextColor,
        fontSize: 14,
        textAlign: 'center',
    },
    stateSubTitleText: {
        fontWeight: 'bold',
        color: colorScheme.quaternaryTextColor,
        fontSize: 12,
        paddingLeft: 5,
    },
    stateSubTitleTextDisabled: {
        fontWeight: 'bold',
        color: colorScheme.tertiaryTextColor,
        fontSize: 12,
        paddingLeft: 5,
    },
    detailText: {
        color: colorScheme.quaternaryTextColor,
        fontSize: 12,
        paddingLeft: 5,
    },
    titleContainer: {
        backgroundColor: colorScheme.primaryContainerColor,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
    },
    detailContainer: {
        backgroundColor: colorScheme.primaryContainerColor,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
    },
    actualText: {
        color: colorScheme.primaryTextColor,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
    },
        actualContainer: {
        backgroundColor: colorScheme.actualColor,
        borderRadius: 9,
        width: 18,
        height: 18,
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
    },
    estimateText: {
        color: colorScheme.primaryTextColor,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
    },
    estimateContainer: {
        backgroundColor: colorScheme.estimateColor,
        borderRadius: 9,
        width: 18,
        height: 18,
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
    },  
    timeView: {
        backgroundColor: colorScheme.primaryContainerColor,
        flexDirection: 'row',
        alignItems: 'center',
     //   justifyContent: 'space-between',
    },



    testView: {
        backgroundColor: colorScheme.tertiaryColor,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
      //  alignItems: 'center',
      //  flexDirection: 'column',
       
    },
    testText: {
       fontWeight: 'bold',
        color: colorScheme.primaryTextColor,
        fontSize: 12,
        textAlign: 'center',
        justifyContent: 'center',
    },

});



                // <Divider 
                //     style={{backgroundColor: 'blue'}}
                // />