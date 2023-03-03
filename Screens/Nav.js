import {
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import MusicPlayer from './MusicPlayer';
import RadioStream from './RadioStream';
import TVStream from './TVStream';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        unmountOnBlur: true,
      }}>
      <Stack.Screen name="Radio" component={RadioStream} />
      <Stack.Screen name="TV" component={TVStream} />
    </Stack.Navigator>
  );
};

export default MyStack;
