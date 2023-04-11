// import React from 'react';
// import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import HomeScreen from './screens/homeScreen.js';
// import RotaBulScreen from './screens/RotaBulScreen.js';
// import AcilCikisScreen from './screens/AcilCikisScreen.js';
// import DepremScreen from './screens/DepremScreen.js';



// const Stack = createNativeStackNavigator();


// function App() {
//   return (
   
//     <NavigationContainer>
//       <Stack.Navigator
//         screenOptions={{
//           headerShown: false,
//           header: () => null,
//         }}
//       >
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="RotaBul" component={RotaBulScreen} />
//         <Stack.Screen name="AcilÇıkış" component={AcilCikisScreen} />
//         <Stack.Screen name="Deprem" component={DepremScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
    
//   );
// }

// export default App;

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/homeScreen.js';
import RotaBulScreen from './screens/RotaBulScreen.js';
import AcilCikisScreen from './screens/AcilCikisScreen.js';
import DepremScreen from './screens/DepremScreen.js';

import PushNotification from 'react-native-push-notification';

import WebSocketService from './service/WebSocketService.js';
import Db from './db/db.js';

const Stack = createNativeStackNavigator();
const db = new Db();
const socket = new WebSocketService();
function App() {
  useEffect(() => {
    socket.connect();

    const processReceivedData = async (data) => {
      const datetime = data.tarih_saat;
      const timeRange = await db.findMatchingTimeRange(datetime, datetime);

      if (timeRange) {
        const imageURI = await db.getImageForTimeRange(timeRange.id);

        PushNotification.localNotification({
          title: 'Yeni Veri Alındı',
          message: 'Sunucudan yeni veri alındı: ' + JSON.stringify(data),
          bigPictureUrl: imageURI,
          playSound: true,
          soundName: 'default',
          importance: 'high',
          priority: 'high',
        });
      } else {
        PushNotification.localNotification({
          title: 'Yeni Veri Alındı',
          message: 'Sunucudan yeni veri alındı: ' + JSON.stringify(data),
          playSound: true,
          soundName: 'default',
          importance: 'high',
          priority: 'high',
        });
      }
    };

    socket.onNewData((data) => {
      console.log('Received data:', data);
      processReceivedData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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



