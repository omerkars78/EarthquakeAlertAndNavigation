import React ,{useContext}from 'react';
import {View, Text} from 'react-native';
import {GlobalSelectContext} from '../Context/GlobalState';


const HeaderAcil = () => {
  const {fontSize} = useContext(GlobalSelectContext);
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
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
};

export default HeaderAcil;
