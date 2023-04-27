import React, {useContext, useState ,useEffect} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {GlobalSelectContext} from '../Context/GlobalState';

const ButtonAcilCikis = () => {
  const {
    buttonText,
    buttonBgColor,
    buttonTextColor,
    stopRouting,
    setButtonBgColor,
    setButtonTextColor,
    setButtonText,
    isRoutingRunning,
    handleButtonPressAcil
  } = useContext(GlobalSelectContext);
  useEffect(() => {
    if (isRoutingRunning === true) {
      setButtonBgColor('red');
      setButtonTextColor('white');
      setButtonText('Durdur');
    } else {
      setButtonBgColor('white');
      setButtonTextColor('black');
      setButtonText('Rota Oluştur');
    }
  }, [isRoutingRunning]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          if (isRoutingRunning) {
            stopRouting();
          } else {
            handleButtonPressAcil();
          }
        }}
        style={[styles.TouchableOpacity, {backgroundColor: buttonBgColor}]}>
        <Text style={[styles.title, {color: buttonTextColor}]}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
  },
  TouchableOpacity: {
    width: '100%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

export default ButtonAcilCikis;
