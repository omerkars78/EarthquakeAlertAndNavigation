import React, {useContext, useState ,useEffect} from 'react';
import { TouchableOpacity, Text, View, Alert} from 'react-native';
import {AcilCikisContext} from '../Context/AcilCikisState';

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
    handleButtonPressAcil,
    text,
    setText
  } = useContext(AcilCikisContext);
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
      <Text
        style={styles.titleText}
        onValueChange={itemValue => setText(itemValue)}>
        {text}
      </Text>
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
  
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            'Uyarı',
            'Bu özellik deprem harici acil durumlarda kullanılması içindir',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
        }}
        style={[styles.TouchableOpacity, {backgroundColor: 'red', marginTop: 10}]}>
        <Text style={[styles.title, {color: 'white'}]}>
          Uyarı
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
  titleText: {
    fontSize: 16,
    color: 'white',
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
