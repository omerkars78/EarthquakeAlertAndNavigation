import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/homeScreen.js';
import RotaBulScreen from './screens/RotaBulScreen.js';
import AcilCikisScreen from './screens/AcilCikisScreen.js';
import DepremScreen from './screens/DepremScreen.js';

import PushNotification from 'react-native-push-notification';
import RNFS from 'react-native-fs';

import WebSocketService from './service/WebSocketService.js';
import Db from './db/db.js';

const Stack = createNativeStackNavigator();
const db = new Db();
const socket = new WebSocketService();

function App() {
  // Helper function to convert datetime to time
function toTime(datetime) {
  return datetime.getHours() * 3600 + datetime.getMinutes() * 60 + datetime.getSeconds();
}

useEffect(() => {
  socket.connect();
  db.getAllImages();
  db.getAllTimeRanges();
  const processReceivedData = async (data) => {
    const datetimeString = data.tarih_saat;
    // const datetime = new Date(datetimeString);
    const adjustTimezone = (time) => {
      const timezoneOffsetInHours = 3;
      const adjustedTime = new Date(time);
      adjustedTime.setHours(adjustedTime.getHours() + timezoneOffsetInHours);
      return adjustedTime;
  };
    const datetime = new Date(datetimeString);
    
    const imagePath = 'https://cdn.karar.com/news/1323298.jpg';
    // const imagePath = 'https://i.pinimg.com/564x/e1/3d/b7/e13db7c5f261fbe97eb8fe0f9f53738d.jpg';
    const timeInSeconds = toTime(datetime);

    const timeRange = await db.isInTimeRange(timeInSeconds);

    if (timeRange) {
      const imageURI = timeRange.imageURI;

      PushNotification.localNotification({
        channelId: "earthquake-alerts",
        title: 'DEPREM UYARISI',
        message: 'ÇÖK KAPAN TUTUN',
        bigPictureUrl: imageURI,
        playSound: true,
        soundName: 'default',
        importance: 'high',
        priority: 'high',
      });
    } else {
      PushNotification.localNotification({
        channelId: "earthquake-alerts",
        title: 'DEPREM UYARISI',
        message: 'ÇÖK KAPAN TUTUN',
        bigPictureUrl: imagePath,
        playSound: true, soundName: 'default',
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
