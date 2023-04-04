// import React, {useContext,useState} from 'react';
// import {TouchableOpacity, Text, View} from 'react-native';
// import {GlobalSelectContext} from '../Context/GlobalState';

// const Button = () => {
//   const GlobalContext = useContext(GlobalSelectContext);

//   return (
//     <View style={styles.container}>
// <TouchableOpacity
//         onPress={() => GlobalContext.handleButtonPress()}
//         style={styles.TouchableOpacity}>
//         <Text style={styles.title}>Rota Oluştur</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = {

//   container: {
//     alignItems: 'center',
//     marginTop: 30,
//     marginBottom: 30,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: 'black',
//     padding: 8,
//     textAlign: 'center',
//   },
//   TouchableOpacity: {
//     backgroundColor: 'white',
//     width: '100%',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
// };

// export default Button;

import React, {useContext, useState ,useEffect} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {GlobalSelectContext} from '../Context/GlobalState';

const Button = () => {
  const {
    buttonText,
    buttonBgColor,
    buttonTextColor,
    handleButtonPress,
    stopRouting,
    selectedArrow,
    bgColor,
    setButtonBgColor,
    setButtonTextColor,
    setButtonText,
    isRoutingRunning,
    setIsRoutingRunning,
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
            handleButtonPress();
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

export default Button;
