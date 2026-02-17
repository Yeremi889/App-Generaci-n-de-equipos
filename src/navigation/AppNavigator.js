import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import PlayerListScreen from '../screens/PlayerListScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mis Grupos' }} />
        <Stack.Screen name="PlayerList" component={PlayerListScreen} options={{ title: 'Jugadores' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}