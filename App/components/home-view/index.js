import React, {Component, PropTypes} from 'react';
import{ View,
        TouchableOpacity,
        StyleSheet,
        Text,
      } from 'react-native';

export default class Home extends Component {
  static propTypes = {
    text: PropTypes.string
  }
  
  static navigationOptions = {
    header: null
  }

  static defaultProps = {
    text: 'Choose port actor'
  }

  render() {
    const { navigate } = this.props.navigation;
    
    return(
      <View style={styles.container}>
        <TouchableOpacity
           activeOpacity = {0.8}
           onPress={() => navigate('ActorSelection')}>
          <View style={[styles.buttonContainer, styles.circularButton]}>
            <Text style={styles.buttonText}>
              {this.props.text}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  circularButton: {
    height: 200,
    width: 200,
    borderRadius: 100,
    backgroundColor: '#89bdd3',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000', 
    shadowRadius: 1,
    shadowOffset: {
      width: 3,
      height: 2
    },
    shadowOpacity: 1.0
  },
  container: {
    flex: 1,
    backgroundColor: '#e3e3e3',
    alignItems: 'center',
    justifyContent: 'center',
  },

});