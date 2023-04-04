// import React, {useContext} from 'react';
// import {View,StyleSheet} from 'react-native';
// import Header from './components/Header';
// import Circle from './components/Circle';
// import SelectMenu from './components/SelectMenu';
// import Button from './components/Button';
// import GlobalProvider, {GlobalSelectContext} from './Context/GlobalState';

// function App() {
//   return (
//     <GlobalProvider>
//       <AppContent />
//     </GlobalProvider>
//   );
// }

// function AppContent() {
//   const {bgColor} = useContext(GlobalSelectContext);
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: 30,
//       backgroundColor: bgColor
//     },
//     girisWrapper: {
//       display: 'flex',
//       flexDirection: 'column',
//       backgroundColor: 'transparent',
//     },
//     circle: {
//       height: 250,
//       backgroundColor: 'white',
//       borderRadius: 250,
//     },
//     icon: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     iconRight: {
//       flex: 1,
//       justifyContent: 'center',
//       transform: [{rotate: '90deg'}],
//       alignItems: 'center',
//     },
//     iconLeft: {
//       flex: 1,
//       justifyContent: 'center',
//       transform: [{rotate: '-90deg'}],
//       transition: 'all 0.5s ease',
//       alignItems: 'center',
//     },
//     iconBottom: {
//       flex: 1,
//       justifyContent: 'center',
//       transform: [{rotate: '-180deg'}],
//       transition: 'all 0.5s ease',
//       alignItems: 'center',
//     },
//   });

//   return (
//     <View style={styles.container}>
//       <View style={styles.girisWrapper}>
//         <Header />
//         <Circle />
//         <SelectMenu />
//         <Button />
//       </View>
//     </View>
//   );
// }

// export default App;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from './components/Header';
import Button from './components/Button';
import GlobalProvider, { GlobalSelectContext } from './Context/GlobalState';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  const { bgColor } = useContext(GlobalSelectContext);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 30,
      backgroundColor: bgColor,
    },
    button: {
      backgroundColor: '#3498db',
      padding: 10,
      borderRadius: 5,
      margin: 10,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RotaBul')}
      >
        <Text style={styles.buttonText}>Rota Bul</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AcilÇıkış')}
      >
        <Text style={styles.buttonText}>Acil Çıkış</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Deprem')}
      >
        <Text style={styles.buttonText}>Deprem</Text>
      </TouchableOpacity>
    </View>
  );
}

function RotaBulScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Rota Bul Screen</Text>
    </View>
  );
}

function AcilÇıkışScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Acil Çıkış Screen</Text>
    </View>
  );
}

function DepremScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Deprem Screen</Text>
    </View>
  );
}

function App() {
  return (
    <GlobalProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="RotaBul" component={RotaBulScreen} />
          <Stack.Screen name="AcilÇıkış" component={AcilÇıkışScreen} />
          <Stack.Screen name="Deprem" component={DepremScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalProvider>
  );
}

export default App;
