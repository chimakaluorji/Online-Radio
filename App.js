import {View, StatusBar, StyleSheet, Image} from 'react-native';
import React, {Component, useState} from 'react';
import ReactMenu from './Screens/ReactMenu';

import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  const [timePass, setTimePass] = useState(false);

  //Time out function to redirect from splash screen to menu screen
  setTimeout(() => {
    setTimePass(true);
  }, 2000);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {timePass === false ? (
        <View>
          <Image
            source={require('./assets/img/ebbc.png')}
            style={styles.image}></Image>
        </View>
      ) : (
        <NavigationContainer>
          <ReactMenu />
        </NavigationContainer>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1729',
  },
  image: {alignItems: 'center', marginTop: 250},
});
