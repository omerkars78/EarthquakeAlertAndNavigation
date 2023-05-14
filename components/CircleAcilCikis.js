import React, {useContext} from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import {View, StyleSheet} from 'react-native';
import {AcilCikisContext} from '../Context/AcilCikisState';

const CircleAcilCikis = () => {
  const {selectedArrow} = useContext(AcilCikisContext);
  
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
    fontSize: selectedArrow === 'dot-fill' ? 100 : 250,
    paddingLeft : selectedArrow === 'dot-fill' ? 115 : 60 && selectedArrow === 'x' ? 75 : 60,
    paddingTop : selectedArrow === 'dot-fill' ? 80 : 0,
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
export default CircleAcilCikis;
