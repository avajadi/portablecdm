import React, {Component, PropTypes} from 'react';
import{ View,
        TouchableWithoutFeedback,
        StyleSheet,
        Text,
      } from 'react-native';
import { StackNavigator } from 'react-navigation';

export default class StartButton extends Component {

  static propTypes = {
    text: PropTypes.string
  }
  
  static defaultProps = {
    text: 'Choose port actor'
  }

  _onButtonPress() {
    
  }

  render() {
    return(
      <TouchableWithoutFeedback
            onPress={this._onButtonPress}>
        <View style={[styles.buttonContainer, styles.circularButton]}>
          <Text style={styles.buttonText}>
            {this.props.text}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: {
    textAlign: 'center',
    color: 'white'
  },
  circularButton: {
    height: 200,
    width: 200,
    borderRadius: 100,
    backgroundColor: 'red',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});