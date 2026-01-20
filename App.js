// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/Map';
import CategoryScreen from './src/screens/CategoryScreen';
import PlaceDetailScreen from './src/screens/PlaceDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
        />
        <Stack.Screen 
          name="Map" 
          component={MapScreen} 
        />
        <Stack.Screen 
          name="Category" 
          component={CategoryScreen} 
        />
        <Stack.Screen 
          name="Place Detail Screen" 
          component={PlaceDetailScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
