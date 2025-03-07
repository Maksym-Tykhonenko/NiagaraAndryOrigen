import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {HomeScreen} from './src/screen/HomeScreen';
import {MapScreen} from './src/screen/MapScreen';
import {QuestsScreen} from './src/screen/QuestsScreen';
import {AlbumsScreen} from './src/screen/AlbumsScreen';
import {ProfileScreen} from './src/screen/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Map') {
              iconName = 'map-outline';
            } else if (route.name === 'Quests') {
              iconName = 'flag-outline';
            } else if (route.name === 'Albums') {
              iconName = 'images-outline';
            } else if (route.name === 'Profile') {
              iconName = 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#2E7D32',
          tabBarInactiveTintColor: '#8E8E8E',
          tabBarStyle: {
            backgroundColor: '#F5F5F5',
            height: 60,
            paddingBottom: 5,
          },
          headerShown: false,
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Quests" component={QuestsScreen} />
        <Tab.Screen name="Albums" component={AlbumsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
