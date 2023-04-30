import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import RotaBulScreen from './RotaBulScreen';
import AcilCikisScreen from './AcilCikisScreen';
import DepremScreen from './DepremScreen';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent = Ionicons;
          let iconName;

          if (route.name === 'RotaBul') {
            iconName = focused ? 'navigate' : 'navigate-outline';
          } else if (route.name === 'AcilÇıkış') {
            IconComponent = FontAwesome5;
            iconName = focused ? 'running' : 'running';
          } else if (route.name === 'Deprem') {
            iconName = focused ? 'warning' : 'warning-outline';
          }

          return <IconComponent name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="RotaBul" component={RotaBulScreen} />
      <Tab.Screen name="AcilÇıkış" component={AcilCikisScreen} />
      <Tab.Screen name="Deprem" component={DepremScreen} />
    </Tab.Navigator>
  );
}

export default HomeScreen;
