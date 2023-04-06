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
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/homeScreen.js';
import RotaBulScreen from './screens/RotaBulScreen.js';
import AcilCikisScreen from './screens/AcilCikisScreen.js';
import DepremScreen from './screens/DepremScreen.js';



const Stack = createNativeStackNavigator();


function App() {
  return (
   
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          header: () => null,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RotaBul" component={RotaBulScreen} />
        <Stack.Screen name="AcilÇıkış" component={AcilCikisScreen} />
        <Stack.Screen name="Deprem" component={DepremScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}

export default App;

// *********************** SOCKET.IO NOTİFİCATİONS ***********************
// import { useEffect } from 'react';
// import io from 'socket.io-client';

// const App = () => {
//   useEffect(() => {
//     const socket = io('http://192.168.1.53:5000');

//     socket.on('new_signal', (data) => {
//       console.log('New signal received:', data);
//       // Show notification here
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   // ... (existing component code)
// };
