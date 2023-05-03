// import React, { useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from './screens/homeScreen.js';
// import RotaBulScreen from './screens/RotaBulScreen.js';
// import AcilCikisScreen from './screens/AcilCikisScreen.js';
// import DepremScreen from './screens/DepremScreen.js';

// import PushNotification from 'react-native-push-notification';

// import WebSocketService from './service/WebSocketService.js';
// import Db from './db/db.js';

// const Stack = createNativeStackNavigator();
// const db = new Db();
// const socket = new WebSocketService();

// function App() {
//   useEffect(() => {
//     socket.connect();

//     const processReceivedData = async (data) => {
//       try {
//         const datetime = data.tarih_saat;
//         const timeRange = await db.findMatchingTimeRange(datetime, datetime);

//         const time = await db.getTimeRange();
//         console.log(time);
        
//         if (timeRange) {
//           const imageURI = await db.getImageForTimeRange(timeRange.id);

//           PushNotification.localNotification({
//             title: 'Yeni Veri Alındı',
//             message: 'Sunucudan yeni veri alındı: ' + JSON.stringify(data),
//             bigPictureUrl: imageURI,
//             playSound: true,
//             soundName: 'default',
//             importance: 'high',
//             priority: 'high',
//           });
//         } else {
//           PushNotification.localNotification({
//             title: 'Yeni Veri Alındı',
//             message: 'Sunucudan yeni veri alındı: ' + JSON.stringify(data),
//             playSound: true,
//             soundName: 'default',
//             importance: 'high',
//             priority: 'high',
//           });
//         }
//       } catch (error) {
//         console.error('An error occurred:', error);
//       }
//     };

//     socket.onNewData((data) => {
//       console.log('Received data:', data);
//       processReceivedData(data);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         screenOptions={{
//           headerShown: false,
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

// import React, { useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from './screens/homeScreen.js';
// import RotaBulScreen from './screens/RotaBulScreen.js';
// import AcilCikisScreen from './screens/AcilCikisScreen.js';
// import DepremScreen from './screens/DepremScreen.js';

// import PushNotification from 'react-native-push-notification';

// import WebSocketService from './service/WebSocketService.js';
// import Db from './db/db.js';

// const Stack = createNativeStackNavigator();
// const db = new Db();
// const socket = new WebSocketService();

// function App() {
//   useEffect(() => {
//     socket.connect();

//     const processReceivedData = async (data) => {
//       try {
//         PushNotification.localNotification({
//           title: 'Yeni Veri Alındı',
//           message: 'Sunucudan yeni veri alındı: ' + JSON.stringify(data),
//           playSound: true,
//           soundName: 'default',
//           importance: 'high',
//           priority: 'high',
//         });
//       } catch (error) {
//         console.error('An error occurred:', error);
//       }
//     };

//     socket.onNewData((data) => {
//       console.log('Received data:', data);
//       processReceivedData(data);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         screenOptions={{
//           headerShown: false,
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




// import React, { useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from './screens/homeScreen.js';
// import RotaBulScreen from './screens/RotaBulScreen.js';
// import AcilCikisScreen from './screens/AcilCikisScreen.js';
// import DepremScreen from './screens/DepremScreen.js';

// import PushNotification from 'react-native-push-notification';

// import WebSocketService from './service/WebSocketService.js';
// import Db from './db/db.js';

// const Stack = createNativeStackNavigator();
// const db = new Db();
// const socket = new WebSocketService();
// function App() {
// useEffect(() => {
//   socket.connect();
//   const processReceivedData = async (data) => {
//     const datetime = data.tarih_saat;
//     const timeRange = await db.findMatchingTimeRange(datetime, datetime);
//     if (timeRange) {
//       const imageURI = await db.getImageForTimeRange(timeRange.id);
//       PushNotification.localNotification({
//         title: 'Yeni Veri Alındı',
//         message: 'Sunucudan yeni veri alındı: ' + JSON.stringify(data),
//         bigPictureUrl: imageURI,
//         playSound: true,
//         soundName: 'default',
//         importance: 'high',
//         priority: 'high',
//       });
//     } else {
//       PushNotification.localNotification({
//         title: 'Yeni Veri Alındı',
//         message: 'Titreşim Algılandı: ' + JSON.stringify(data),
//         playSound: true,
//         soundName: 'default',
//         importance: 'high',
//         priority: 'high',
//       });
//     }
//   };
//   socket.onNewData((data) => {
//     console.log('Received data:', data);
//     processReceivedData(data);
//   });
//   return () => {
//     socket.disconnect();
//   };
// }, []);
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         screenOptions={{
//           headerShown: false,
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
  // Helper function to convert datetime to time
function toTime(datetime) {
  return datetime.getHours() * 3600 + datetime.getMinutes() * 60 + datetime.getSeconds();
}

useEffect(() => {
  socket.connect();
  
  const processReceivedData = async (data) => {
    const datetimeString = data.tarih_saat;
    const datetime = new Date(datetimeString);

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
        title: 'DEPREM UYARISI else',
        message: 'ÇÖK KAPAN TUTUN',
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
