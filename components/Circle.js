import React, {useContext} from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import {View, StyleSheet} from 'react-native';
import {GlobalSelectContext} from '../Context/GlobalState';

const Circle = () => {
  const {selectedArrow} = useContext(GlobalSelectContext);
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'center',
    },
    circle: {
      height: 250,
      backgroundColor: 'white',
      borderRadius: 250,
    },
    icon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: selectedArrow === 'dot-fill' ? 100 : 250 && selectedArrow === 'fold-up' ? 180 : 250 && selectedArrow === 'fold-down' ? 180 : 250,
    paddingLeft : selectedArrow === 'dot-fill' ? 115 : 60 && selectedArrow === 'x' ? 75 : 60 && selectedArrow === 'fold-up' ? 50 : 60 && selectedArrow === 'fold-down' ? 50 : 60,
    paddingTop : selectedArrow === 'dot-fill' ? 80 : 0 && selectedArrow === 'fold-up' ? 25 : 0 && selectedArrow === 'fold-down' ? 25 : 0,
    color: 'black',  }
  
  });
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
      <Icon name={selectedArrow} style = {styles.icon} />
      </View>
    </View>
  );
};
export default Circle;
