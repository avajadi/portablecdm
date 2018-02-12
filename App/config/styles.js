import React, { Component } from 'react';
import colorScheme from '../config/colors'; //Hehe

const styles = {
    containers: {
        main: {
            flex: 1,
            alignItems: 'center',
            paddingTop: 50,
            paddingBottom: 50,
        },
        regular: {
            flex: 1,
            backgroundColor: colorScheme.backgroundColor,
            alignItems: 'center',
          },
        centralizer: {
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
        },
        flow: {
            flexDirection: 'row',
        },
        blank: {
            padding: 20,
        },
        subContainer: {
            backgroundColor: colorScheme.primaryColor,
            padding: 10,
        },
        softBorder: {
            borderWidth: 0.3,
            borderRadius: 3,
        },
        info: {
            backgroundColor: colorScheme.primaryContainerColor,
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 10,
            marginRight: 10,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            flexDirection: 'column',
            borderRadius: 5,
          },
    },
    fonts: {
        white: {
            color: 'white',
        }
    },
    images: {
      logos: {
          rise: {
            margin: 20,
            width: 75,
            height: 75,
          },
          euCoFinance: {
            width: 358,
            height: 50,
            marginTop: 10,
          },
          stm: {
            margin: 20,
            width: 138,
            height: 75,
          },
      }  
    },
    texts: {
        infoText: {
            marginLeft: 10, 
            marginRight: 10, 
            color: colorScheme.quaternaryTextColor, 
            marginTop: 4
          },
          headerText: {
            textAlign: 'center',
            color: colorScheme.quaternaryTextColor,
            fontSize: 18,
            fontWeight: 'bold',
          },
    }
}

export default styles;