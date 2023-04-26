import React ,{useContext}from 'react';
import {View, Text} from 'react-native';
import {GlobalSelectContext} from '../Context/GlobalState';


const HeaderAcil = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acil Çıkış</Text>
    </View>
  );
};

const styles = {
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    widht : '100%',
    borderRadius: 10,

   
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 80,
    marginRight: 80,
  },
};

export default HeaderAcil;
