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
}

export default styles;