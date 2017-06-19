import React, {Component, PropTypes} from 'react';
import{ View,
        TouchableWithoutFeedback,
        StyleSheet,
        Text,
      } from 'react-native';

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
    const { navigate } = this.props.navigation;
    
    return(
      <View style={styles.container}>
        <TouchableWithoutFeedback
              onPress={() => navigate('ActorListView')}>
          <View style={[styles.buttonContainer, styles.circularButton]}>
            <Text style={styles.buttonText}>
              {this.props.text}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
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
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});